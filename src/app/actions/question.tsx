'use server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

export async function createQuestion(pollId: string, type: string, questionText: string, possibleAnswers: string[]) {
	const uniqueId = nanoid();
	const questionKey = `question:${uniqueId}`;

	await redis.hSet(questionKey, {
		type,
		pollId,
		questionText,
		possibleAnswers: JSON.stringify(possibleAnswers),
	});
	await redis.sAdd(`poll:${pollId}:questions`, uniqueId);
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
	await redis.del(questionKey);
	await redis.sRem(`poll:${question.pollId}:questions`, questionId);
}
