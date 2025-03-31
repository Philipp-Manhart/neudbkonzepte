import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { pollRunIdConverter } from '@/lib/converter';

export async function GET(request: Request, { params }: { params: { pollRunId: string } }) {
	const { pollRunId } = await params;
	const pollRunKey = await pollRunIdConverter(pollRunId);

	// Verify poll run exists
	const exists = await redis.exists(pollRunKey);
	if (!exists) {
		return new NextResponse(JSON.stringify({ error: 'Poll run not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	// Set up SSE headers
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			// Flag to track if cleanup has been initiated
			let cleanupInitiated = false;

			// Create a subscriber instance for Redis
			const subscriber = redis.duplicate();
			await subscriber.connect();

			// Define a cleanup function that can only be executed once
			const cleanup = async () => {
				// If cleanup is already in progress, don't try again
				if (cleanupInitiated) return;

				// Mark cleanup as initiated
				cleanupInitiated = true;

				try {
					// Clean up Redis resources first
					await subscriber.unsubscribe().catch((e) => console.error('Redis unsubscribe error:', e));
					await subscriber.disconnect().catch((e) => console.error('Redis disconnect error:', e));
				} catch (error) {
					console.error('Error during Redis cleanup:', error);
				}

				// Remove the abort listener to prevent any chance of multiple cleanup attempts
				try {
					request.signal.removeEventListener('abort', abortHandler);
				} catch (err) {
					console.error('Error removing event listener:', err);
				}
			};

			// Handle connection close with a named function we can remove
			const abortHandler = async () => {
				await cleanup();

				try {
					controller.close();
				} catch (error) {
					console.error('Note: Controller may already be closed:', error.message);
				}
			};

			// Add the abort handler
			request.signal.addEventListener('abort', abortHandler);

			try {
				// Send initial participant count and current question index
				const participantsCount = await redis.hGet(pollRunKey, 'participantsCount');
				const currentQuestionIndex = (await redis.hGet(pollRunKey, 'currentQuestionIndex')) || '0';
				const questionsCount = await redis.zCard(`${pollRunKey}:questions`);

				// Send the initial participant count
				const initialParticipantData = {
					event: 'participant-update',
					data: { participantsCount: participantsCount || '0' },
				};
				controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialParticipantData)}\n\n`));

				// Send the initial question index
				const initialQuestionData = {
					event: 'question-update',
					data: {
						currentQuestionIndex,
						isLastQuestion: parseInt(currentQuestionIndex) === questionsCount - 1,
					},
				};
				controller.enqueue(
					encoder.encode(`event: question-update\ndata: ${JSON.stringify(initialQuestionData.data)}\n\n`)
				);

				// Subscribe to poll run updates
				await subscriber.subscribe(`poll-run:${pollRunId}:updates`, (message) => {
					try {
						// Only enqueue if cleanup hasn't started
						if (!cleanupInitiated) {
							const messageData = JSON.parse(message);

							// Format the message as an SSE event based on its type
							if (messageData.event === 'question-update') {
								controller.enqueue(
									encoder.encode(`event: question-update\ndata: ${JSON.stringify(messageData.data)}\n\n`)
								);
							} else if (messageData.event === 'results-update') {
								controller.enqueue(
									encoder.encode(`event: results-update\ndata: ${JSON.stringify(messageData.data)}\n\n`)
								);
							} else {
								controller.enqueue(encoder.encode(`data: ${message}\n\n`));
							}
						}
					} catch (error) {
						console.error('Error processing message:', error);
						// If we encounter an error while processing a message, initiate cleanup
						if (!cleanupInitiated) {
							cleanup().catch((e) => console.error('Cleanup error after message processing failure:', e));
						}
					}
				});
			} catch (error) {
				console.error('Error setting up SSE:', error);
				cleanup().catch((e) => console.error('Cleanup error after setup failure:', e));

				// If setup fails, try to close the controller directly
				try {
					controller.close();
				} catch (closeError) {
					console.error('Could not close controller after setup error:', closeError.message);
				}
			}
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		},
	});
}
