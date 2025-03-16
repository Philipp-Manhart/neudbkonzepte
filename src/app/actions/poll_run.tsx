'use server';
import { redis } from '@/lib/redis';
import { customAlphabet } from 'nanoid';
import { redirect } from 'next/navigation';
import { pollIdConverter, keyConverter, questionIdConverter, pollRunIdConverter } from '@/lib/converter';

// Delete should not really delete

export async function startPollRun(pollId: string) {
	const pollKey = await await pollIdConverter(pollId);
	const pollRunId = customAlphabet('abcdefghkmnpqrstuvwxyzADEFGHJKLMNPQRTUVWXY234679', 6)();
	const pollRunKey = await pollRunIdConverter(pollRunId);

	try {
		const multi = redis.multi();

		const duration = await redis.hGet(pollKey, 'defaultduration');
		const questionCount = await redis.zCard(`${pollKey}:questions`);
		const runDuration = Date.now() + parseInt(duration || '0') * questionCount; // duration in seconds, question count in seconds

		multi.hSet(pollRunKey, {
			pollKey,
			status: 'open',
			start: Date.now(),
			runDuration,
		});

		multi.zAdd(`${pollKey}:poll_runs`, { score: Date.now(), value: pollRunKey });

		const pollRun = await redis.hGetAll(pollRunKey);

		await multi.exec();
		return { success: true, pollRunId, pollRun };
	} catch (error) {
		console.error('Fehler beim Erstellen des Abstimmungslaufs:', error);
		return { success: false, error: 'Erstellung des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function addTimeToPollRun(pollRunId: string, addedTime: number) {
	const pollRunKey = await pollRunIdConverter(pollRunId);
	const pollRun = await redis.hGetAll(pollRunKey);
	if (!Object.keys(pollRun).length) {
		return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
	}

	const multi = redis.multi();

	multi.hIncrBy(pollRunKey, 'runDuration', addedTime);

	try {
		await multi.exec();
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Hinzufügen von Zeit zum Abstimmungslauf:', error);
		return { success: false, error: 'Hinzufügen von Zeit fehlgeschlagen' };
	}
}

export async function endPollRun(pollRunId: string) {
	const pollRunKey = await pollRunIdConverter(pollRunId);
	const pollRun = await redis.hGetAll(pollRunKey);
	if (!Object.keys(pollRun).length) {
		return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
	}
	const multi = redis.multi();
	multi.hSet(pollRunKey, {
		status: 'closed',
		end: Date.now(),
	});

	try {
		await multi.exec();
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Beenden des Abstimmungslaufs:', error);
		return { success: false, error: 'Beenden des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function getPollRun(pollRunId: string) {
	const pollRunKey = await pollRunIdConverter(pollRunId);
	const pollRun = await redis.hGetAll(pollRunKey);
	if (!Object.keys(pollRun).length) {
		return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
	} else {
		pollRun.pollKey = pollRunKey;
		return { success: true, pollRun };
	}
}

export async function getPollRunsByPollId(pollId: string) {
	try {
		const pollKey = await pollIdConverter(pollId);
		const pollRunKeys = await redis.zRange(`${pollKey}:poll_runs`, 0, -1);
		if (!pollRunKeys || pollRunKeys.length === 0) {
			return { success: false, error: 'Keine Abstimmungsläufe vorhanden' };
		}

		const multi = redis.multi();

		for (const pollRunKey of pollRunKeys) {
			multi.hGetAll(pollRunKey);
		}

		const pollRunsData = await multi.exec();
		const pollRuns = pollRunsData.map((result, index) => {
			const pollRunData = result || {};
			return {
				pollRunKey: pollRunKeys[index],
				...pollRunData,
			};
		});

		return { success: true, pollRuns };
	} catch (error) {
		console.error('Fehler beim Abrufen der Abstimmungsläufe:', error);
		return { success: false, error: 'Abrufen der Abstimmungsläufe fehlgeschlagen' };
	}
}

export async function getPollRunsByOwner(userKey: string) {}

export async function getPollRunsByParticipant(userKey: string) {}

export async function deletePollRun(pollRunId: string) {
	const pollRunKey = await pollRunIdConverter(pollRunId);
	const pollRun = await redis.hGetAll(pollRunKey);
	if (!Object.keys(pollRun).length) {
		return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
	}

	const multi = redis.multi();

	multi.del(pollRunKey);
	multi.zRem(`${pollRun.pollKey}:poll_runs`, pollRunKey);

	try {
		await multi.exec();
		return { success: true };
	} catch (error) {
		console.error('Fehler beim Löschen des Abstimmungslaufs:', error);
		return { success: false, error: 'Löschung des Abstimmungslaufs fehlgeschlagen' };
	}
}

export async function enterPollRun(enterCode: string) {
	try {
		const pollRunKey = await pollRunIdConverter(enterCode);
		const pollExists = await redis.exists(pollRunKey);
		if (!pollExists) {
			return { success: false, error: 'Abstimmungslauf nicht vorhanden' };
		}
		const status = await redis.hGet(pollRunKey, 'status');
		if (status !== 'open') {
			return { success: false, error: 'Abstimmungslauf ist nicht geöffnet' };
		}
		redirect(`/participate/${enterCode}`);
	} catch (error) {
		console.error('Fehler beim Betreten des Abstimmungslaufs:', error);
		return { success: false, error: 'Fehler beim Betreten des Abstimmungslaufs' };
	}
}

//poll_run:(id):questions
// -ids

//poll_run:(id):question:(id):result
// -answers + count
// -status

// for auth users
// user:(id):poll_runs
// -ids

// user:(id):poll_run:(id):questions
// -ids

// user:(id):poll_run:(id):question:(id):answer
// -answer
