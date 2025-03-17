'use server';
import { redis } from '@/lib/redis';
import { customAlphabet } from 'nanoid';
import { redirect } from 'next/navigation';
import { pollIdConverter, keyConverter, questionIdConverter, pollRunIdConverter } from '@/lib/converter';

// ids as return converter etc.

export async function startPollRun(pollId: string) {
	const pollKey = await pollIdConverter(pollId);
	const pollRunId = customAlphabet('abcdefghkmnpqrstuvwxyzADEFGHJKLMNPQRTUVWXY234679', 6)();
	const pollRunKey = await pollRunIdConverter(pollRunId);

	try {
		const multi = redis.multi();

		const duration = await redis.hGet(pollKey, 'defaultduration');
		const questionCount = await redis.zCard(`${pollKey}:questions`);
		const runDuration = Date.now() + parseInt(duration || '0') * questionCount; // duration in seconds, question count in seconds

		multi.hSet(pollRunKey, {
			pollKey,
			status: 'open',
			start: Date.now(),
			runDuration,
		});

		multi.zAdd(`${pollKey}:poll_runs`, { score: Date.now(), value: pollRunKey });

		await multi.exec();
		return { success: true, pollRunId };
	} catch (error) {
		console.error('Fehler beim Erstellen des Abstimmungslaufs:', error);
		return { success: false, error: 'Erstellung des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function addTimeToPollRun(pollRunId: string, addedTime: number) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRun = await redis.hGetAll(pollRunKey);
		if (!Object.keys(pollRun).length) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
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
			const pollId = await keyConverter(pollKey);
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
	// Implementation to be added
	return { success: false, error: 'Funktion noch nicht implementiert' };
}

export async function deletePollRun(pollRunId: string) {
	try {
		const pollRunKey = await pollRunIdConverter(pollRunId);
		const pollRun = await redis.hGetAll(pollRunKey);
		if (!Object.keys(pollRun).length) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}

		const multi = redis.multi();

		multi.del(pollRunKey);
		multi.zRem(`${pollRun.pollKey}:poll_runs`, pollRunKey);

		await multi.exec();
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Löschen des Abstimmungslaufs:', error);
		return { success: false, error: 'Löschung des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function enterPollRun(enterCode: string) {
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
		redirect(`/participate/${enterCode}`);
	} catch (error) {
		console.error('Fehler beim Betreten des Abstimmungslaufs:', error);
		return { success: false, error: 'Fehler beim Betreten des Abstimmungslaufs' };
	}
}

//poll_run:(id):questions
// -ids

//poll_run:(id):question:(id):result
// -answers + count
// -status

// for auth users
// user:(id):poll_runs
// -ids

// user:(id):poll_run:(id):questions
// -ids

// user:(id):poll_run:(id):question:(id):answer
// -answer
