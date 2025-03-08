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

