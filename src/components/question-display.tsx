'use client';
import { useState, useEffect, useRef } from 'react';
import ScaleQuestion from './question-types/ScaleQuestion';
import SingleChoiceQuestion from './question-types/SingleChoiceQuestion';
import MultipleChoiceQuestion from './question-types/MultipleChoiceQuestion';
import YesNoQuestion from './question-types/YesNoQuestion';
import { useCurrentQuestionSSE } from '@/hooks/use-current-question-sse';
import { updateCurrentQuestion } from '@/app/actions/poll_run';

interface Question {
	id: string;
	questionText: string;
	type: string;
	possibleAnswers?: string[];
	position: number;
}

interface QuestionDisplayProps {
	questions: any[];
	pollRunId: string;
	defaultDuration: number;
	isOwner?: boolean;
}

export default function QuestionDisplay({
	questions,
	pollRunId,
	defaultDuration,
	isOwner = false,
}: QuestionDisplayProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [timeLeft, setTimeLeft] = useState<number>(parseInt(defaultDuration as any) || 30);
	const [pollCompleted, setPollCompleted] = useState(false);
	const [isAdvancing, setIsAdvancing] = useState(false);

	const updateInProgress = useRef(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	// Use the SSE hook to listen for question updates
	const { currentQuestionIndex: sseQuestionIndex, error: sseError } = useCurrentQuestionSSE(pollRunId, (data) => {
		const newIndex = parseInt(data.currentQuestionIndex);
		console.log(`Received question update from SSE: ${newIndex}`);

		// Reset timer when question changes via SSE
		if (newIndex !== currentQuestionIndex) {
			setTimeLeft(defaultDuration);
		}
	});

	// When the SSE index changes, update our local state
	useEffect(() => {
		// Only update if the SSE index is different from our current index
		if (sseQuestionIndex !== currentQuestionIndex) {
			console.log(`Updating from SSE: ${sseQuestionIndex}`);
			setCurrentQuestionIndex(sseQuestionIndex);
			setTimeLeft(defaultDuration);

			// Check if we've completed the poll
			if (sseQuestionIndex >= questions.length) {
				setPollCompleted(true);
			}
		}
	}, [sseQuestionIndex, currentQuestionIndex, questions.length, defaultDuration]);

	const currentQuestion = currentQuestionIndex < questions.length ? questions[currentQuestionIndex] : null;

	// Function to advance to the next question (for timer or manual navigation)
	const advanceToNextQuestion = async () => {
		if (updateInProgress.current || isAdvancing) return;

		setIsAdvancing(true);
		updateInProgress.current = true;

		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		if (currentQuestionIndex < questions.length - 1) {
			console.log(`Advancing from question ${currentQuestionIndex} to ${currentQuestionIndex + 1}`);

			if (isOwner) {
				// If the user is the poll owner, use the server action to update the question
				const result = await updateCurrentQuestion(pollRunId, 'next');
				if (!result.success) {
					console.error('Failed to advance question:', result.error);
				}
			} else {
				// For participants, just update the local state
				setCurrentQuestionIndex((prev) => prev + 1);
				setTimeLeft(defaultDuration);
			}
		} else {
			console.log('All questions completed');
			setPollCompleted(true);

			// If owner, update the server state to mark the poll as completed
			if (isOwner) {
				// Optional: Add server action to mark poll as completed
			}
		}

		// Allow updates again after a short delay
		setTimeout(() => {
			updateInProgress.current = false;
			setIsAdvancing(false);
		}, 50);
	};

	// Go to previous question (only available for poll owner)
	const goToPreviousQuestion = async () => {
		if (updateInProgress.current || isAdvancing || !isOwner || currentQuestionIndex <= 0) return;

		setIsAdvancing(true);
		updateInProgress.current = true;

		const result = await updateCurrentQuestion(pollRunId, 'previous');
		if (!result.success) {
			console.error('Failed to go to previous question:', result.error);
		}

		setTimeout(() => {
			updateInProgress.current = false;
			setIsAdvancing(false);
		}, 50);
	};

	// Timer effect
	useEffect(() => {
		if (pollCompleted || !questions.length || currentQuestionIndex >= questions.length) {
			return;
		}

		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		timerRef.current = setInterval(() => {
			setTimeLeft((prevTime) => {
				const newTime = prevTime - 1;

				if (newTime <= 0) {
					// If timer ends and user is an owner, advance the question on the server
					if (isOwner) {
						setTimeout(advanceToNextQuestion, 10);
					}
					return 0;
				}
				return newTime;
			});
		}, 1000);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [pollCompleted, questions.length, currentQuestionIndex, isOwner]);

	if (!questions || questions.length === 0) {
		return <div className="flex justify-center items-center h-screen">No questions available</div>;
	}

	if (pollCompleted) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<h2 className="text-2xl font-bold mb-4">Poll Completed</h2>
				<p>Thank you for participating!</p>
			</div>
		);
	}

	if (!currentQuestion) {
		return <div className="flex justify-center items-center h-screen">Loading question...</div>;
	}

	// No need to parse - possibleAnswers is already an array
	const options = currentQuestion.possibleAnswers || [];

	// Function to render the appropriate question component based on type
	const renderQuestionComponent = () => {
		switch (currentQuestion.type) {
			case 'scale':
				return (
					<ScaleQuestion
						questionId={currentQuestion.questionId}
						questionText={currentQuestion.questionText}
						pollRunId={pollRunId}
						isOwner={isOwner}
					/>
				);
			case 'single-choice':
				return (
					<SingleChoiceQuestion
						questionId={currentQuestion.questionId}
						questionText={currentQuestion.questionText}
						options={options}
						pollRunId={pollRunId}
						isOwner={isOwner}
					/>
				);
			case 'multiple-choice':
				return (
					<MultipleChoiceQuestion
						questionId={currentQuestion.questionId}
						questionText={currentQuestion.questionText}
						options={options}
						pollRunId={pollRunId}
						isOwner={isOwner}
					/>
				);
			case 'yes-no':
				return (
					<YesNoQuestion
						questionId={currentQuestion.questionId}
						questionText={currentQuestion.questionText}
						pollRunId={pollRunId}
						isOwner={isOwner}
					/>
				);
			default:
				return (
					<div>
						<h3 className="text-xl font-semibold mb-4">{currentQuestion.questionText}</h3>
						<p>Question Type: {currentQuestion.type}</p>
						{options.length > 0 && (
							<ul className="space-y-2 mt-4">
								{options.map((option, index) => (
									<li key={index} className="border p-3 rounded-md">
										{option}
									</li>
								))}
							</ul>
						)}
					</div>
				);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-screen p-4">
			<div className="w-full max-w-lg">
				<div className="mb-8 text-center">
					<h2 className="text-2xl font-bold mb-2">
						Question {currentQuestionIndex + 1} of {questions.length}
					</h2>
					<div className="h-2 w-full rounded-full">
						<div
							className="bg-amber-500 h-2 rounded-full"
							style={{ width: `${((currentQuestionIndex + 1) * 100) / questions.length}%` }}></div>
					</div>
				</div>

				<div className="shadow-md rounded-lg p-6 mb-6">{renderQuestionComponent()}</div>

				<div className="text-center">
					<div className="text-xl font-bold">Time remaining: {timeLeft} seconds</div>
					<div className="h-3 w-full rounded-full mt-2">
						<div
							className="bg-green-500 h-3 rounded-full transition-all duration-1000"
							style={{ width: `${(timeLeft * 100) / (parseInt(defaultDuration as any) || 30)}%` }}></div>
					</div>

					{/* Navigation controls for poll owner */}
					{isOwner && (
						<div className="flex justify-between mt-6">
							<button
								onClick={goToPreviousQuestion}
								disabled={currentQuestionIndex <= 0 || isAdvancing}
								className={`px-4 py-2 rounded ${
									currentQuestionIndex <= 0 || isAdvancing
										? 'bg-gray-300 text-gray-500'
										: 'bg-blue-500 text-white hover:bg-blue-600'
								}`}>
								Previous Question
							</button>

							<button
								onClick={advanceToNextQuestion}
								disabled={currentQuestionIndex >= questions.length - 1 || isAdvancing}
								className={`px-4 py-2 rounded ${
									currentQuestionIndex >= questions.length - 1 || isAdvancing
										? 'bg-gray-300 text-gray-500'
										: 'bg-blue-500 text-white hover:bg-blue-600'
								}`}>
								Next Question
							</button>
						</div>
					)}

					{/* Display SSE error if any */}
					{sseError && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">Connection error: {sseError}</div>}
				</div>
			</div>
		</div>
	);
}
