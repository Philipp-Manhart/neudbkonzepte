'use server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';
import { pollIdConverter, keyConverter, questionIdConverter } from '@/lib/converter';

// Delete and Updates should not really delete
export async function createQuestion(pollId: string, type: string, questionText: string, possibleAnswers?: string[]) {
	const pollKey = await pollIdConverter(pollId);
	const questionId = nanoid();
	const questionKey = await questionIdConverter(questionId);

	const multi = redis.multi();
	
	// Create basic question data
	const questionData: Record<string, string> = {
		type, // 'single' | 'multiple' | 'yes/no' | 'scale'
		pollKey,
		questionText,
	};
	
	// Only add possibleAnswers if provided
	if (possibleAnswers) {
		questionData.possibleAnswers = JSON.stringify(possibleAnswers);
	}
	
	multi.hSet(questionKey, questionData);

	const timestamp = Date.now();
	multi.zAdd(`${pollKey}:questions`, { score: timestamp, value: questionKey });

	try {
		await multi.exec();
		return { success: true, questionId };
	} catch (error) {
		console.error('Fehler beim Erstellen der Frage:', error);
		return { success: false, error: 'Erstellung der Frage fehlgeschlagen' };
	}
}

export async function getQuestion(questionId: string) {
	try {
		const questionKey = await questionIdConverter(questionId);
		const question = await redis.hGetAll(questionKey);
		if (!question || Object.keys(question).length === 0) {
			return { success: false, error: 'Frage nicht vorhanden' };
		}

		question.possibleAnswers = JSON.parse(question.possibleAnswers || '[]');
		return {
			success: true,
			question: {
				...question,
				questionId,
			},
		};
	} catch (error) {
		console.error('Fehler beim Abrufen der Frage:', error);
		return { success: false, error: 'Abrufen der Frage fehlgeschlagen' };
	}
}

export async function getQuestionsByPollId(pollId: string) {
	try {
		const pollKey = await pollIdConverter(pollId);
		const questionKeys = await redis.zRange(`${pollKey}:questions`, 0, -1);
		if (!questionKeys || questionKeys.length === 0) {
			return { success: false, error: 'Keine Fragen vorhanden' };
		}

		const multi = redis.multi();

		for (const questionKey of questionKeys) {
			multi.hGetAll(questionKey);
		}

		const questionsData = await multi.exec();
		const questions = await Promise.all(
			questionsData.map(async (result, index) => {
				const questionData = result || {};
				questionData.possibleAnswers = JSON.parse(questionData.possibleAnswers || '[]');
				const questionKey = questionKeys[index];
				const questionId = await keyConverter(questionKey);
				return {
					questionId,
					...questionData,
				};
			})
		);

		return { success: true, questions };
	} catch (error) {
		console.error('Fehler beim Abrufen der Fragen:', error);
		return { success: false, error: 'Abrufen der Fragen fehlgeschlagen' };
	}
}

export async function updateQuestion(
	questionId: string,
	type: string,
	questionText: string,
	possibleAnswers: string[]
) {
	try {
		const questionKey = await questionIdConverter(questionId);
		const question = await redis.hGetAll(questionKey);
		if (!question || Object.keys(question).length === 0) {
			return { success: false, error: 'Frage nicht vorhanden' };
		}

		await redis.hSet(questionKey, {
			type,
			questionText,
			possibleAnswers: JSON.stringify(possibleAnswers),
		});

		return { success: true, questionId };
	} catch (error) {
		console.error('Fehler beim Aktualisieren der Frage:', error);
		return { success: false, error: 'Aktualisierung der Frage fehlgeschlagen' };
	}
}

export async function deleteQuestion(questionId: string) {
	try {
		const questionKey = await questionIdConverter(questionId);
		const question = await redis.hGetAll(questionKey);
		if (!question || Object.keys(question).length === 0) {
			return { success: false, error: 'Frage nicht vorhanden' };
		}

		const multi = redis.multi();

		multi.del(questionKey);
		multi.zRem(`${question.pollKey}:questions`, questionKey);

		await multi.exec();
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Löschen der Frage:', error);
		return { success: false, error: 'Löschung der Frage fehlgeschlagen' };
	}
}
