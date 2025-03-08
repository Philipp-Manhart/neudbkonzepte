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

	await redis.hSet(pollId, {
		owner,
		name,
		description,
		status,
		defaultduration,
	});
	await redis.sAdd(`user:${owner}:polls`, pollId);
}

export async function getPoll(pollId: string) {
	const poll = await redis.hGetAll(pollId);
	if (!poll) {
		return { success: false, error: 'Abstimmung nicht vorhanden' };
	}
	return poll;
}

export async function getPolls(userId: string) {
	const polls = await redis.sMembers(`user:${userId}:polls`);
	if (!polls) {
		return { success: false, error: 'Keine Abstimmungen vorhanden' };
	}
	return polls;
}
