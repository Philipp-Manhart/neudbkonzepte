'use server';
import { redis } from '@/lib/redis';
import { customAlphabet } from 'nanoid';
import { pollIdConverter, keyConverter, pollRunIdConverter } from '@/lib/converter';

// ids as return converter etc.

export async function createPollRun(pollId: string) {
	const pollKey = await pollIdConverter(pollId);
	const pollRunId = customAlphabet('abcdefghkmnpqrstuvwxyzADEFGHJKLMNPQRTUVWXY234679', 6)();
	const pollRunKey = await pollRunIdConverter(pollRunId);

	try {
		// Set basic poll run information
		await redis.hSet(pollRunKey, {
			pollKey: String(pollKey),
			status: 'open',
			created: String(Date.now()),
			runDuration: String(
				Date.now() +
					parseInt((await redis.hGet(pollKey, 'defaultduration')) || '0') * (await redis.zCard(`${pollKey}:questions`))
			),
			participantsCount: '0',
		});

		// Add poll run to poll's list
		await redis.zAdd(`${pollKey}:poll_runs`, { score: Date.now(), value: pollRunKey as string });

		// Get and process questions
		const questionKeys = await redis.zRange(`${pollKey}:questions`, 0, -1);

		for (const questionKey of questionKeys) {
			const questionData = await redis.hGetAll(questionKey);
			if (Object.keys(questionData).length) {
				const questionId = await keyConverter(questionKey);

				// Ensure possibleAnswers is properly stringified
				let possibleAnswers = '';

				try {
					if (questionData.options) {
						if (typeof questionData.options === 'string') {
							// Try to parse it to verify it's valid JSON, then use as is
							JSON.parse(questionData.options);
							possibleAnswers = questionData.options;
						} else {
							// Otherwise stringify it
							possibleAnswers = JSON.stringify(questionData.options);
						}
					}
				} catch {
					// If any error in parsing, stringify it
					possibleAnswers = JSON.stringify(questionData.options || '[]');
				}

				// Store question data for poll run
				await redis.hSet(`${pollRunKey}:question:${questionId}`, {
					type: questionData.type || 'single',
					questionText: questionData.text || '',
					possibleAnswers: possibleAnswers,
				});

				// Initialize question results
				await redis.hSet(`${pollRunKey}:question:${questionId}:results`, {
					initialized: String(Date.now()),
				});

				// Add question to poll run's question list
				await redis.zAdd(`${pollRunKey}:questions`, {
					score: parseInt(questionData.position as string) || 0,
					value: questionId as string,
				});
			}
		}

		return { success: true, pollRunId };
	} catch (error) {
		console.error('Fehler beim Erstellen des Abstimmungslaufs:', error);
		return { success: false, error: 'Erstellung des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function startPollRun(pollRunId: string) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		await redis.hSet(pollRunKey, {
			status: 'running',
			started: Date.now(),
		});
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Starten des Abstimmungslaufs:', error);
		return { success: false, error: 'Starten des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function addTimeToPollRun(pollRunId: string, addedTime: number) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRun = await redis.hGetAll(pollRunKey);
		if (!Object.keys(pollRun).length) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}

		if (pollRun.status !== 'running') {
			return { success: false, error: 'Zeit kann nur zu laufenden Abstimmungen hinzugefügt werden' };
		}

		await redis.hIncrBy(pollRunKey, 'runDuration', addedTime);
		return { success: true, pollRunId };
	} catch (error) {
		console.error('Fehler beim Hinzufügen von Zeit zum Abstimmungslauf:', error);
		return { success: false, error: 'Hinzufügen von Zeit fehlgeschlagen' };
	}
}

export async function subtractTimeFromPollRun(pollRunId: string, subtractedTime: number) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRun = await redis.hGetAll(pollRunKey);
		if (!Object.keys(pollRun).length) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}

		if (pollRun.status !== 'running') {
			return { success: false, error: 'Zeit kann nur von laufenden Abstimmungen abgezogen werden' };
		}

		await redis.hIncrBy(pollRunKey, 'runDuration', -subtractedTime);
		return { success: true, pollRunId };
	} catch (error) {
		console.error('Fehler beim Abziehen von Zeit vom Abstimmungslauf:', error);
		return { success: false, error: 'Abziehen von Zeit fehlgeschlagen' };
	}
}

export async function endPollRun(pollRunId: string) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRun = await redis.hGetAll(pollRunKey);
		if (!Object.keys(pollRun).length) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}

		if (pollRun.status !== 'running') {
			return { success: false, error: 'Nur laufende Abstimmungen können beendet werden' };
		}

		await redis.hSet(pollRunKey, {
			status: 'closed',
			end: Date.now(),
		});

		return { success: true, pollRunId };
	} catch (error) {
		console.error('Fehler beim Beenden des Abstimmungslaufs:', error);
		return { success: false, error: 'Beenden des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function getPollRun(pollRunId: string) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRun = await redis.hGetAll(pollRunKey);
		if (!Object.keys(pollRun).length) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}

		const pollId = pollRun.pollKey ? await keyConverter(pollRun.pollKey) : '';

		return {
			success: true,
			pollRun: {
				...pollRun,
				pollId,
				pollRunId,
			},
		};
	} catch (error) {
		console.error('Fehler beim Abrufen des Abstimmungslaufs:', error);
		return { success: false, error: 'Abrufen des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function getPollRunsByPollId(pollId: string) {
	try {
		const pollKey = await pollIdConverter(pollId);
		const pollRunKeys = await redis.zRange(`${pollKey}:poll_runs`, 0, -1);
		if (!pollRunKeys || pollRunKeys.length === 0) {
			return { success: false, error: 'Keine Abstimmungsläufe vorhanden' };
		}

		const multi = redis.multi();

		for (const pollRunKey of pollRunKeys) {
			multi.hGetAll(pollRunKey);
		}

		const pollRunsData = await multi.exec();
		const pollRunsPromises = pollRunsData.map(async (result, index) => {
			const pollRunData = result || {};
			const pollRunKey = pollRunKeys[index];
			const pollRunId = await keyConverter(pollRunKey);
			return {
				...pollRunData,
				pollRunId,
				pollId,
			};
		});

		const pollRuns = await Promise.all(pollRunsPromises);
		return { success: true, pollRuns };
	} catch (error) {
		console.error('Fehler beim Abrufen der Abstimmungsläufe:', error);
		return { success: false, error: 'Abrufen der Abstimmungsläufe fehlgeschlagen' };
	}
}

export async function getPollRunsByOwner(userKey: string) {
	try {
		const pollKeys = await redis.zRange(`${userKey}:polls`, 0, -1);
		if (!pollKeys || pollKeys.length === 0) {
			return { success: false, error: 'Keine Abstimmungen vorhanden' };
		}

		const allPollRuns = [];

		for (const pollKey of pollKeys) {
			const pollIdResult = await keyConverter(pollKey);
			const pollId = Array.isArray(pollIdResult) ? pollIdResult[0] : pollIdResult;
			const result = await getPollRunsByPollId(pollId);
			if (result.success && result.pollRuns) {
				allPollRuns.push(...result.pollRuns);
			}
		}

		if (allPollRuns.length === 0) {
			return { success: false, error: 'Keine Abstimmungsläufe vorhanden' };
		}

		return { success: true, pollRuns: allPollRuns };
	} catch (error) {
		console.error('Fehler beim Abrufen der Abstimmungsläufe:', error);
		return { success: false, error: 'Abrufen der Abstimmungsläufe fehlgeschlagen' };
	}
}
export async function getPollRunsByParticipant(userKey: string) {
	try {
		const pollRunKeys = await redis.zRange(`${userKey}:participations`, 0, -1);

		if (!pollRunKeys || pollRunKeys.length === 0) {
			return { success: false, error: 'Keine Teilnahmen vorhanden' };
		}

		const multi = redis.multi();
		for (const pollRunKey of pollRunKeys) {
			multi.hGetAll(pollRunKey);
		}

		const pollRunsData = await multi.exec();
		const pollRunsPromises = pollRunsData.map(async (result, index) => {
			const pollRunData = result || {};
			const pollRunKey = pollRunKeys[index];
			const pollRunId = await keyConverter(pollRunKey);

			const pollKey = (pollRunData as Record<string, string>).pollKey;
			const pollId = pollKey ? await keyConverter(pollKey) : '';

			return {
				...pollRunData,
				pollRunId,
				pollId,
			};
		});

		const pollRuns = await Promise.all(pollRunsPromises);
		return { success: true, pollRuns };
	} catch (error) {
		console.error('Fehler beim Abrufen der Teilnahmen:', error);
		return { success: false, error: 'Abrufen der Teilnahmen fehlgeschlagen' };
	}
}

export async function deletePollRun(pollRunId: string) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRun = await redis.hGetAll(pollRunKey);
		if (!Object.keys(pollRun).length) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}

		const multi = redis.multi();
		const pollKey = pollRun.pollKey as string;

		multi.del(pollRunKey);
		multi.zRem(`${pollKey}:poll_runs`, pollRunKey);

		await multi.exec();
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Löschen des Abstimmungslaufs:', error);
		return { success: false, error: 'Löschung des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function enterPollRun(enterCode: string, userKey?: string) {
	try {
		const pollRunKey = await pollRunIdConverter(enterCode);
		const pollExists = await redis.exists(pollRunKey);
		if (!pollExists) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}
		const status = await redis.hGet(pollRunKey, 'status');
		if (status !== 'open') {
			return { success: false, error: 'Abstimmungslauf ist nicht geöffnet' };
		}

		// Increment participants count
		await redis.hIncrBy(pollRunKey, 'participantsCount', 1);

		// Get the updated count
		const newParticipantsCount = await redis.hGet(pollRunKey, 'participantsCount');

		// Publish update to subscribers
		await redis.publish(
			`poll-run:${enterCode}:updates`,
			JSON.stringify({
				event: 'participant-update',
				data: { participantsCount: newParticipantsCount },
			})
		);

		if (userKey) {
			const multi = redis.multi();
			multi.sAdd(`${pollRunKey}:participants`, userKey);
			multi.zAdd(`${userKey}:participations`, {
				score: Date.now(),
				value: pollRunKey as string,
			});
			await multi.exec();
		}

		return { success: true, pollRunId: enterCode };
	} catch (error) {
		console.error('Fehler beim Betreten des Abstimmungslaufs:', error);
		return { success: false, error: 'Fehler beim Betreten des Abstimmungslaufs' };
	}
}

export async function saveUserAnswer(
	pollRunId: string,
	questionId: string,
	answers: string | string[],
	userId?: string
) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRunExists = await redis.exists(pollRunKey);
		if (!pollRunExists) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}

		// Check if the poll is still running or open
		const status = await redis.hGet(pollRunKey, 'status');
		if (status !== 'running' && status !== 'open') {
			return { success: false, error: 'Abstimmungslauf ist nicht aktiv' };
		}

		// Get question data to check type
		const questionKey = `${pollRunKey}:question:${questionId}`;
		const questionData = await redis.hGetAll(questionKey);

		if (!Object.keys(questionData).length) {
			return { success: false, error: 'Frage nicht vorhanden' };
		}

		const isMultipleChoice = questionData.type === 'multiple';
		const answersArray = Array.isArray(answers) ? answers : [answers];

		// Validate that we're receiving the correct answer format for the question type
		if (!isMultipleChoice && Array.isArray(answers) && answers.length > 1) {
			return { success: false, error: 'Mehrfachauswahl ist für diese Frage nicht erlaubt' };
		}

		const multi = redis.multi();
		const resultsKey = `${pollRunKey}:question:${questionId}:results`;

		// If user already answered this question, get previous answers to decrement them
		if (userId) {
			const userAnswerKey = `user:${userId}:poll_run:${pollRunId}:question:${questionId}`;
			const previousAnswersData = await redis.get(userAnswerKey);

			if (previousAnswersData) {
				let previousAnswers: string[];
				try {
					previousAnswers = JSON.parse(previousAnswersData);
					if (!Array.isArray(previousAnswers)) {
						previousAnswers = [previousAnswersData];
					}

					// Decrement previous answers
					for (const prevAnswer of previousAnswers) {
						multi.hIncrBy(resultsKey, prevAnswer, -1);
					}
				} catch {
					// If parsing fails, assume it was a single string answer
					multi.hIncrBy(resultsKey, previousAnswersData, -1);
				}
			}

			// Save the new user answers
			multi.set(userAnswerKey, JSON.stringify(answersArray));
		}

		// Increment the count for each selected answer
		for (const answer of answersArray) {
			multi.hIncrBy(resultsKey, answer, 1);
		}

		await multi.exec();
		return { success: true, questionId, answers };
	} catch (error) {
		console.error('Fehler beim Speichern der Antwort:', error);
		return { success: false, error: 'Speichern der Antwort fehlgeschlagen' };
	}
}

export async function getQuestionResults(pollRunId: string, userKey?: string) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRunExists = await redis.exists(pollRunKey);

		if (!pollRunExists) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}

		// Get all questions for this poll run
		const questionIds = await redis.zRange(`${pollRunKey}:questions`, 0, -1);

		if (!questionIds.length) {
			return { success: false, error: 'Keine Fragen gefunden' };
		}

		const questions = [];

		for (const questionId of questionIds) {
			const questionKey = `${pollRunKey}:question:${questionId}`;
			const resultsKey = `${pollRunKey}:question:${questionId}:results`;

			const questionDataPromise = redis.hGetAll(questionKey);
			const resultsDataPromise = redis.hGetAll(resultsKey);

			let userAnswerPromise: Promise<string | null> | undefined;
			if (userKey) {
				userAnswerPromise = redis.get(`${userKey}:poll_run:${pollRunId}:question:${questionId}`);
			}

			const [questionData, resultsData, userAnswerData] = await Promise.all(
				[questionDataPromise, resultsDataPromise, userAnswerPromise].filter(Boolean) as [
					Promise<Record<string, string>>,
					Promise<Record<string, string>>,
					(Promise<string | null> | undefined)?
				]
			);

			// Parse possible answers with error handling
			let possibleAnswers = [];
			if (questionData.possibleAnswers) {
				try {
					possibleAnswers = JSON.parse(questionData.possibleAnswers);
				} catch {
					console.error('Fehler beim Parsen der möglichen Antworten');
				}
			}

			// Format the results - exclude initialization data and convert to numbers
			const formattedResults: Record<string, number> = {};
			Object.entries(resultsData).forEach(([key, value]) => {
				if (key !== 'initialized') {
					formattedResults[key] = parseInt(value as string, 10) || 0;
				}
			});

			// Build question object
			const questionObj: {
				questionId: string;
				type: string;
				questionText: string;
				possibleAnswers: unknown[];
				results: Record<string, number>;
				userAnswers?: string[];
			} = {
				questionId,
				type: questionData.type,
				questionText: questionData.questionText,
				possibleAnswers,
				results: formattedResults,
			};

			// Add user answers if available
			if (userKey && userAnswerData) {
				try {
					const userAnswers = JSON.parse(typeof userAnswerData === 'string' ? userAnswerData : '');
					questionObj.userAnswers = Array.isArray(userAnswers) ? userAnswers : [userAnswers];
				} catch {
					questionObj.userAnswers = [userAnswerData];
				}
			}

			questions.push(questionObj);
		}

		return {
			success: true,
			pollRunId,
			questions,
		};
	} catch (error) {
		console.error('Fehler beim Abrufen der Ergebnisse:', error);
		return { success: false, error: 'Abrufen der Ergebnisse fehlgeschlagen' };
	}
}
