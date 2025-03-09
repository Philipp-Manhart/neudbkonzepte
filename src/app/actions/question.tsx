'use server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

export async function createQuestion(pollId: string, type: string, questionText: string, possibleAnswers: string[]) {
	const uniqueId = nanoid();
	const questionKey = `question:${uniqueId}`;

	const multi = redis.multi();

	multi.hSet(questionKey, {
		type,
		pollId,
		questionText,
		possibleAnswers: JSON.stringify(possibleAnswers),
	});

	multi.sAdd(`poll:${pollId}:questions`, uniqueId);
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
		return null;
	}

	const multi = redis.multi();

	multi.del(questionKey);
	multi.sRem(`poll:${question.pollId}:questions`, questionId);
	await multi.exec();
}
