'use server';
// enter und create überarbeiten wegen poll_run
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
	const timestamp = Date.now();
	multi.zAdd(`user:${owner}:polls`, { score: timestamp, value: pollId });

	try {
		await multi.exec();
		const poll = await getPoll(pollId);
		return { success: true, id: uniqueId, poll };
	} catch (error) {
		return { success: false, error: 'Erstellung fehlgeschlagen' };
	}
}

export async function getPoll(pollId: string) {
	const poll = await redis.hGetAll(pollId);
	if (!poll) {
		return { success: false, error: 'Abstimmung nicht vorhanden' };
	}
	return poll;
}

export async function getPollsByOwner(userId: string) {
	const pollIds = await redis.zRange(`user:${userId}:polls`, 0, -1, { REV: true });
	if (!pollIds || pollIds.length === 0) {
		return { success: false, error: 'Keine Abstimmungen vorhanden' };
	}

	const multi = redis.multi();

	for (const pollId of pollIds) {
		multi.hGetAll(pollId);
	}

	const pollsData = await multi.exec();
	const polls = pollsData.map((result, index) => {
		const pollData = result || {};
		return {
			id: pollIds[index].replace('poll:', ''),
			...pollData,
		};
	});

	return polls;
}

export async function deletePoll(pollId: string) {
	const poll = await redis.hGetAll(pollId);
	if (!Object.keys(poll).length) {
		return { success: false, error: 'Abstimmung nicht vorhanden' };
	}

	const multi = redis.multi();

	const questionIds = await redis.zRange(`${pollId}:questions`, 0, -1);
	for (const questionId of questionIds) {
		const questionKey = `question:${questionId}`;
		multi.del(questionKey);
	}

	multi.del(`${pollId}:questions`);
	multi.del(pollId);
	multi.zRem(`user:${poll.owner}:polls`, pollId);

	await multi.exec();
	return { success: true };
}
