'use client';

import { useState, useEffect } from 'react';

interface QuestionUpdateData {
	currentQuestionIndex: string;
	isLastQuestion: boolean;
}

function useCurrentQuestionSSE(pollRunId: string, callback?: (data: QuestionUpdateData) => void) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!pollRunId) {
			setError('Poll run ID is required');
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

				eventSource.addEventListener('question-update', (event) => {
					try {
						const parsedData = JSON.parse(event.data);
						const questionIndex = parseInt(parsedData.currentQuestionIndex);
						setCurrentQuestionIndex(questionIndex);

						if (callback) {
							callback(parsedData);
						}
					} catch (e) {
						console.error('Error parsing question update:', e);
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
	}, [pollRunId, callback]);

	return {
		currentQuestionIndex,
		error,
	};
}

export { useCurrentQuestionSSE };
