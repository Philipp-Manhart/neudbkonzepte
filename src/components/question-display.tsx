'use client';
import { useState, useEffect, useRef } from 'react';
import ScaleQuestion from './question-types/ScaleQuestion';
import SingleChoiceQuestion from './question-types/SingleChoiceQuestion';
import MultipleChoiceQuestion from './question-types/MultipleChoiceQuestion';
import YesNoQuestion from './question-types/YesNoQuestion';

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
}

export default function QuestionDisplay({ questions, pollRunId, defaultDuration }: QuestionDisplayProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [timeLeft, setTimeLeft] = useState<number>(parseInt(defaultDuration as any) || 30);
	const [pollCompleted, setPollCompleted] = useState(false);

	const updateInProgress = useRef(false);

	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const currentQuestion = currentQuestionIndex < questions.length ? questions[currentQuestionIndex] : null;

	const advanceToNextQuestion = () => {
		if (updateInProgress.current) return;

		updateInProgress.current = true;

		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}

		if (currentQuestionIndex < questions.length - 1) {
			console.log(`Advancing from question ${currentQuestionIndex} to ${currentQuestionIndex + 1}`);
			setCurrentQuestionIndex((prev) => prev + 1);
			setTimeLeft(defaultDuration);
		} else {
			console.log('All questions completed');
			setPollCompleted(true);
		}

		// Allow updates again after a short delay
		setTimeout(() => {
			updateInProgress.current = false;
		}, 50);
	};

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
					setTimeout(advanceToNextQuestion, 10);
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
	}, );

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
				return <ScaleQuestion questionId={currentQuestion.questionId} questionText={currentQuestion.questionText} pollRunId={pollRunId}/>;

			case 'single-choice':
				return (
					<SingleChoiceQuestion
						questionId={currentQuestion.questionId}
						questionText={currentQuestion.questionText}
						options={options}
						pollRunId={pollRunId}
					/>
				);

			case 'multiple-choice':
				return (
					<MultipleChoiceQuestion
						questionId={currentQuestion.questionId}
						questionText={currentQuestion.questionText}
						options={options}
						pollRunId={pollRunId}
					/>
				);

			case 'yes-no':
				return (
					<YesNoQuestion
						questionId={currentQuestion.questionId}
						questionText={currentQuestion.questionText}
						pollRunId={pollRunId}
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

					{/* Debug button to manually advance questions during testing */}
					{process.env.NODE_ENV === 'development' && (
						<button onClick={advanceToNextQuestion} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
							Next Question (Debug)
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
