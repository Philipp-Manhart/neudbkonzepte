'use server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';


// Delete and Updates should not really delete
export async function createQuestion(pollKey: string, type: string, questionText: string, possibleAnswers?: string[]) {
	const uniqueId = nanoid();
	const questionKey = `question:${uniqueId}`;

	const multi = redis.multi();

	multi.hSet(questionKey, {
		type, // 'single' | 'multiple' | 'yes/no' | 'scale'
		pollKey,
		questionText,
		possibleAnswers: JSON.stringify(possibleAnswers), // only for 'single' and 'multiple'
	});

	const timestamp = Date.now();
	multi.zAdd(`${pollKey}:questions`, { score: timestamp, value: questionKey });

	try {
		await multi.exec();
		return { success: true, questionKey };
	} catch (error) {
		console.error('Fehler beim Erstellen der Frage:', error);
		return { success: false, error: 'Erstellung der Frage fehlgeschlagen' };
	}
}

export async function getQuestion(questionKey: string) {
	try {
		const question = await redis.hGetAll(questionKey);
		if (!question || Object.keys(question).length === 0) {
			return { success: false, error: 'Frage nicht vorhanden' };
		}

		question.possibleAnswers = JSON.parse(question.possibleAnswers || '[]');
		return {
			success: true,
			question: {
				...question,
				questionKey,
			},
		};
	} catch (error) {
		console.error('Fehler beim Abrufen der Frage:', error);
		return { success: false, error: 'Abrufen der Frage fehlgeschlagen' };
	}
}

export async function getQuestionsByPollId(pollKey: string) {
	try {
		const questionKeys = await redis.zRange(`${pollKey}:questions`, 0, -1);
		if (!questionKeys || questionKeys.length === 0) {
			return { success: false, error: 'Keine Fragen vorhanden' };
		}

		const multi = redis.multi();

		for (const questionKey of questionKeys) {
			multi.hGetAll(questionKey);
		}

		const questionsData = await multi.exec();
		const questions = questionsData.map((result, index) => {
			const questionData = result || {};
			questionData.possibleAnswers = JSON.parse(questionData.possibleAnswers || '[]');
			return {
				questionKey: questionKeys[index],
				...questionData,
			};
		});

		return { success: true, questions };
	} catch (error) {
		console.error('Fehler beim Abrufen der Fragen:', error);
		return { success: false, error: 'Abrufen der Fragen fehlgeschlagen' };
	}
}

export async function updateQuestion(
	questionKey: string,
	type: string,
	questionText: string,
	possibleAnswers: string[]
) {
	try {
		const question = await redis.hGetAll(questionKey);
		if (!question || Object.keys(question).length === 0) {
			return { success: false, error: 'Frage nicht vorhanden' };
		}

		await redis.hSet(questionKey, {
			type,
			questionText,
			possibleAnswers: JSON.stringify(possibleAnswers),
		});

		return { success: true, questionKey };
	} catch (error) {
		console.error('Fehler beim Aktualisieren der Frage:', error);
		return { success: false, error: 'Aktualisierung der Frage fehlgeschlagen' };
	}
}

export async function deleteQuestion(questionKey: string) {
	try {
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
