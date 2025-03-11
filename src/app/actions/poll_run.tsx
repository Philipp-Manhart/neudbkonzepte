'use server';
import { redis } from '@/lib/redis';
import { nanoid, customAlphabet } from 'nanoid';
import { redirect } from 'next/navigation';

// delete questions and update and delete poll uddaten

// poll:(id):poll_runs
// -ids

// poll_runs(id)
// -status
// -start
// -end

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

export async function enterPollRun(pollId: string) {
	const pollExists = await redis.exists(`poll:${pollId}`);
	if (!pollExists) {
		return { success: false, error: 'Abstimmung nicht vorhanden' };
	} else {
		redirect(`/poll/${pollId}`);
	}
}


	// const uniqueId = customAlphabet('abcdefghkmnpqrstuvwxyzADEFGHJKLMNPQRTUVWXY234679', 6);
