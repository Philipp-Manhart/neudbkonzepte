'use client';

import { useState, useEffect } from 'react';

interface ResultsData {
	questionId: string;
	results: Record<string, number>;
}

function useCurrentResultsSSE(pollRunId: string, questionId: string, callback?: (data: ResultsData) => void) {
	const [results, setResults] = useState<Record<string, number>>({});
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!pollRunId || !questionId) {
			setError('Poll run ID and question ID are required');
			return;
		}

		let eventSource: EventSource | null = null;
		let isClosed = false;

		const connectSSE = () => {
			try {
				// Close any existing connection
				if (eventSource) {
					eventSource.close();
				}

				// Connect to SSE endpoint
				eventSource = new EventSource(`/api/poll-events/${pollRunId}`);

				// Setup event listeners
				eventSource.onopen = () => {
					setError(null);
				};

				eventSource.onerror = (err) => {
					console.error('SSE error:', err);
					if (!isClosed) {
						setError('Connection error. Attempting to reconnect...');
						// Close the errored connection
						eventSource?.close();
						eventSource = null;
						// Try to reconnect after a delay
						setTimeout(connectSSE, 3000);
					}
				};

				eventSource.addEventListener('results-update', (event) => {
					try {
						const parsedData = JSON.parse(event.data);

						// Only process updates for the current question
						if (parsedData.questionId === questionId) {
							setResults(parsedData.results);
							setIsLoading(false);

							if (callback) {
								callback(parsedData);
							}
						}
					} catch (e) {
						console.error('Error parsing results update:', e);
					}
				});
			} catch (e) {
				console.error('Error setting up SSE connection:', e);
				setError('Failed to connect to event source');
			}
		};

		connectSSE();

		// Cleanup function
		return () => {
			isClosed = true;
			if (eventSource) {
				eventSource.close();
			}
		};
	}, [pollRunId, questionId, callback]);

	return {
		results,
		isLoading,
		error,
	};
}

export { useCurrentResultsSSE };
