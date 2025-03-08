'use server';

import { redis } from '@/lib/redis';
import { nanoid, customAlphabet } from 'nanoid';
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
}
