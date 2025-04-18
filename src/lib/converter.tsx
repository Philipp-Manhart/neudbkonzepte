export async function keyConverter(key: string | string[]): Promise<string | string[]> {
  if (Array.isArray(key)) {
    return key.map(k => k.split(':')[1]);
  }
  return key.split(':')[1];
}

export async function pollIdConverter(pollId: string) {
	return `poll:${pollId}`;
}

export async function questionIdConverter(questionId: string) {
  return `question:${questionId}`;
}

export async function pollRunIdConverter(pollRunId: string) {
  return `poll_run:${pollRunId}`;
}