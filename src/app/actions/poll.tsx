'use server';

import { redis } from '@/lib/redis';
// import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';

export async function enterPoll(pollId: string) {
  const pollExists = await redis.exists(`poll:${pollId}`);
  if (!pollExists) {
    return { success: false, error: 'Abstimmung nicht vorhanden' };
  }
  else {
    redirect(`/poll/${pollId}`);
  }
}





