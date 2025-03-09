'use server';

import { redis } from '@/lib/redis';
import { customAlphabet } from 'nanoid';
import { redirect } from 'next/navigation';

export async function enterPoll(pollId: string) {
	const pollExists = await redis.exists(`poll:${pollId}`);
	if (!pollExists) {
		return { success: false, error: 'Abstimmung nicht vorhanden' };
	} else {
		redirect(`/poll/${pollId}`);
	}
}

export async function createPoll(owner: string, name: string, description: string, defaultduration: string) {
	const uniqueId = customAlphabet('abcdefghkmnpqrstuvwxyzADEFGHJKLMNPQRTUVWXY234679', 6);
	const pollId = `poll:${uniqueId}`;
	const status = 'closed';

	const multi = redis.multi();

	multi.hSet(pollId, {
		owner,
		name,
		description,
		status,
		defaultduration,
	});
	multi.sAdd(`user:${owner}:polls`, pollId);
	await multi.exec();
}

export async function getPoll(pollId: string) {
	const poll = await redis.hGetAll(pollId);
	if (!poll) {
		return { success: false, error: 'Abstimmung nicht vorhanden' };
	}
	return poll;
}

export async function getPollsByOwner(userId: string) {
	const polls = await redis.sMembers(`user:${userId}:polls`);
	if (!polls) {
		return { success: false, error: 'Keine Abstimmungen vorhanden' };
	}
	return polls;
}

export async function deletePoll(pollId: string) {
	const poll = await redis.hGetAll(pollId);
	if (!Object.keys(poll).length) {
		return { success: false, error: 'Abstimmung nicht vorhanden' };
	}

	const multi = redis.multi();

	const questionIds = await redis.sMembers(`${pollId}:questions`);

	for (const questionId of questionIds) {
		const questionKey = `question:${questionId}`;
		multi.del(questionKey);
	}

	multi.del(`${pollId}:questions`);
	multi.del(pollId);
	multi.sRem(`user:${poll.owner}:polls`, pollId);

	await multi.exec();
	return { success: true };
}
