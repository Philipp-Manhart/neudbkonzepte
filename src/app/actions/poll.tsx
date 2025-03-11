'use server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

export async function createPoll(owner: string, name: string, description: string, defaultduration: string) {
	const uniqueId = nanoid();

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
		console.error('Fehler beim Erstellen der Umfrage:', error);
		return { success: false, error: 'Erstellung der Umfrage fehlgeschlagen' };
	}
}

export async function updatePoll(pollId: string, name: string, description: string, defaultduration: string) {} //TODO

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

	try {
		await multi.exec();
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Löschen der Umfrage:', error);
		return { success: false, error: 'Löschung der Umfrage fehlgeschlagen' };
	}
}

export async function getPoll(pollId: string) {
	try {
		const poll = await redis.hGetAll(pollId);
		if (!poll || Object.keys(poll).length === 0) {
			return { success: false, error: 'Abstimmung nicht vorhanden' };
		}
		return poll;
	} catch (error) {
		console.error('Fehler beim Abrufen der Umfrage:', error);
		return { success: false, error: 'Abrufen der Umfrage fehlgeschlagen' };
	}
}

export async function getPollsByOwner(userId: string) {
	try {
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
	} catch (error) {
		console.error('Fehler beim Abrufen der Umfragen:', error);
		return { success: false, error: 'Abrufen der Umfragen fehlgeschlagen' };
	}
}
