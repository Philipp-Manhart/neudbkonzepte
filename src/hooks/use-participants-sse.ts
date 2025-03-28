import { useState, useEffect } from 'react';

export interface ParticipantsData {
	participantsCount: string;
}

export function useParticipantsSSE(pollRunId: string) {
	const [participantsCount, setParticipantsCount] = useState<string>('0');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!pollRunId) {
			setError('No poll run ID provided');
			setLoading(false);
			return;
		}

		setLoading(true);
		let eventSource: EventSource;

		try {
			eventSource = new EventSource(`/api/poll-events/${pollRunId}`);

			eventSource.onmessage = (event) => {
				try {
					const eventData = JSON.parse(event.data);
					if (eventData.event === 'participant-update' && eventData.data) {
						setParticipantsCount(eventData.data.participantsCount);
						setLoading(false);
					}
				} catch (err) {
					console.error('Error parsing event data:', err);
				}
			};

			eventSource.onerror = (err) => {
				console.error('EventSource error:', err);
				setError('Connection error');
				setLoading(false);
				eventSource.close();
			};
		} catch (err) {
			console.error('Error setting up EventSource:', err);
			setError('Failed to connect to event source');
			setLoading(false);
		}

		return () => {
			if (eventSource) {
				eventSource.close();
			}
		};
	}, [pollRunId]);

	return { participantsCount, error, loading };
}
