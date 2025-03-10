'use server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

export async function createQuestion(pollId: string, type: string, questionText: string, possibleAnswers?: string[]) {
	const uniqueId = nanoid();
	const questionKey = `question:${uniqueId}`;

	const multi = redis.multi();

	multi.hSet(questionKey, {
		type, // 'single' | 'multiple' | 'yes/no' | 'scale'
		pollId,
		questionText,
		possibleAnswers: JSON.stringify(possibleAnswers), // only for 'single' and 'multiple'
	});

	const timestamp = Date.now();
	multi.zAdd(`poll:${pollId}:questions`, { score: timestamp, value: uniqueId });
	await multi.exec();
}

export async function getQuestion(questionId: string) {
	const questionKey = `question:${questionId}`;
	const question = await redis.hGetAll(questionKey);
	if (!question) {
		return null;
	}
	question.possibleAnswers = JSON.parse(question.possibleAnswers);
	return question;
}

export async function getQuestionsByPollId(pollId: string) {
	const questionIds = await redis.zRange(`poll:${pollId}:questions`, 0, -1);
	if (!questionIds || questionIds.length === 0) {
		return { success: false, error: 'Keine Fragen vorhanden' };
	}

	const multi = redis.multi();

	for (const questionId of questionIds) {
		multi.hGetAll(`question:${questionId}`);
	}

	const questionsData = await multi.exec();
	const questions = questionsData.map((result, index) => {
		const questionData = result || {};
		questionData.possibleAnswers = JSON.parse(questionData.possibleAnswers);
		return {
			id: questionIds[index].replace('question:', ''),
			...questionData,
		};
	});

	return questions;
}

export async function updateQuestion(
	questionId: string,
	type: string,
	questionText: string,
	possibleAnswers: string[]
) {
	const questionKey = `question:${questionId}`;

	await redis.hSet(questionKey, {
		type,
		questionText,
		possibleAnswers: JSON.stringify(possibleAnswers),
	});
}

export async function deleteQuestion(questionId: string) {
	const questionKey = `question:${questionId}`;
	const question = await redis.hGetAll(questionKey);
	if (!question) {
		return { success: false, error: 'Fehler beim Löschen' };
	}

	const multi = redis.multi();

	multi.del(questionKey);
	multi.zRem(`poll:${question.pollId}:questions`, questionId);
	await multi.exec();
}
