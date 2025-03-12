'use server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

// Delete and Updates should not really delete
export async function createPoll(owner: string, name: string, description: string, defaultduration: string) {
	const uniqueId = nanoid();
	const pollKey = `poll:${uniqueId}`;
	const status = 'closed';

	const multi = redis.multi();

	multi.hSet(pollKey, {
		owner,
		name,
		description,
		status,
		defaultduration,
	});
	const timestamp = Date.now();
	multi.zAdd(`${owner}:polls`, { score: timestamp, value: pollKey });

	try {
		await multi.exec();
		return { success: true, pollKey };
	} catch (error) {
		console.error('Fehler beim Erstellen der Umfrage:', error);
		return { success: false, error: 'Erstellung der Umfrage fehlgeschlagen' };
	}
}

export async function updatePoll(pollKey: string, name: string, description: string, defaultduration: string) {
	try {
		const poll = await redis.hGetAll(pollKey);
		if (!Object.keys(poll).length) {
			return { success: false, error: 'Abstimmung nicht vorhanden' };
		}

		await redis.hSet(pollKey, {
			name,
			description,
			defaultduration,
		});

		return { success: true, pollKey };
	} catch (error) {
		console.error('Fehler beim Aktualisieren der Umfrage:', error);
		return { success: false, error: 'Aktualisierung der Umfrage fehlgeschlagen' };
	}
}

export async function deletePoll(pollKey: string) {
	const poll = await redis.hGetAll(pollKey);
	if (!Object.keys(poll).length) {
		return { success: false, error: 'Abstimmung nicht vorhanden' };
	}

	const multi = redis.multi();

	const questionKeys = await redis.zRange(`${pollKey}:questions`, 0, -1);
	for (const questionKey of questionKeys) {
		multi.del(questionKey);
	}

	multi.del(`${pollKey}:questions`);
	multi.del(pollKey);
	multi.zRem(`user:${poll.owner}:polls`, pollKey);

	try {
		await multi.exec();
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Löschen der Umfrage:', error);
		return { success: false, error: 'Löschung der Umfrage fehlgeschlagen' };
	}
}

export async function getPoll(pollKey: string) {
	try {
		const poll = await redis.hGetAll(pollKey);
		if (!poll || Object.keys(poll).length === 0) {
			return { success: false, error: 'Abstimmung nicht vorhanden' };
		}
		const questionCount = await redis.zCard(`${pollKey}:questions`);

		return {
			...poll,
			pollKey,
			questionCount,
		};
	} catch (error) {
		console.error('Fehler beim Abrufen der Umfrage:', error);
		return { success: false, error: 'Abrufen der Umfrage fehlgeschlagen' };
	}
}

export async function getPollsByOwner(userKey: string) {
	try {
		const pollKeys = await redis.zRange(`${userKey}:polls`, 0, -1, { REV: true });
		if (!pollKeys || pollKeys.length === 0) {
			return { success: false, error: 'Keine Abstimmungen vorhanden' };
		}

		const multi = redis.multi();

		for (const pollKey of pollKeys) {
			multi.hGetAll(pollKey);
		}

		const pollsData = await multi.exec();
		
		const questionCountsPromises = pollKeys.map(pollKey => 
			redis.zCard(`${pollKey}:questions`)
		);
		const questionCounts = await Promise.all(questionCountsPromises);
		
		const polls = pollsData.map((result, index) => {
			const pollData = result || {};
			return {
				pollKey: pollKeys[index],
				questionCount: questionCounts[index] || 0,
				...pollData,
			};
		});

		return polls;
	} catch (error) {
		console.error('Fehler beim Abrufen der Umfragen:', error);
		return { success: false, error: 'Abrufen der Umfragen fehlgeschlagen' };
	}
}
