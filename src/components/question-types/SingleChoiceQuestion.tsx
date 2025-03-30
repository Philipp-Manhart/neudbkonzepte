'use client';
import { useState } from 'react';
import SubmitAnswer from './SubmitAnswer';
import { saveUserAnswer } from '@/app/actions/poll_run';
import QuestionVotesChart from '@/components/app-question-votes-chart';

interface SingleChoiceQuestionProps {
	questionId: string;
	questionText: string;
	options: string[];
	onAnswerSelected?: (value: string) => void;
	pollRunId: string;
	isOwner?: boolean;
}

export default function SingleChoiceQuestion({
	questionId,
	questionText,
	options,
	onAnswerSelected,
	pollRunId,
	isOwner = false,
}: SingleChoiceQuestionProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	// Generate mock chart data based on the options
	//TODO Hier die echten Daten für das Live ergebnis

	const mockChartData = options.map((option) => ({
		option,
		votes: Math.floor(Math.random() * 10) + 1, // Random votes between 1-10
	}));

	// Show chart immediately if user is the owner
	if (isOwner || isSaved) {
		return (
			<div className="py-4 px-2 sm:px-0">
				<h3 className="text-xl font-semibold mb-4 text-center sm:text-left">{questionText}</h3>
				<QuestionVotesChart title={questionText} chartData={mockChartData} />
			</div>
		);
	}

	const handleSubmit = async () => {
		if (!selectedOption) return;

		try {
			setIsSaving(true);
			await saveUserAnswer(pollRunId, questionId, selectedOption);
			setIsSaved(true);
		} catch (error) {
			console.error('Error saving answer:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleOptionClick = (option: string) => {
		// Prevent changes if answer is already saved
		if (isSaved) return;

		setSelectedOption(option);
		if (onAnswerSelected) {
			onAnswerSelected(option);
		}
	};

	return (
		<div className="py-4 px-2 sm:px-0">
			<h3 className="text-xl font-semibold mb-4 text-center sm:text-left">{questionText}</h3>

			<ul className="space-y-2 max-w-md mx-auto sm:mx-0">
				{options.map((option, index) => (
					<li
						key={index}
						onClick={() => handleOptionClick(option)}
						className={`border p-3 rounded-md transition-all ${
							selectedOption === option
								? 'bg-amber-100 border-amber-500 dark:bg-amber-900/30 dark:border-amber-400'
								: 'hover:bg-gray-50 dark:hover:bg-gray-800'
						} ${isSaved ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
						<div className="flex items-center">
							<div
								className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
									selectedOption === option
										? 'border-amber-500 dark:border-amber-400'
										: 'border-gray-400 dark:border-gray-600'
								}`}>
								{selectedOption === option && (
									<div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400"></div>
								)}
							</div>
							<span className="text-sm sm:text-base">{option}</span>
						</div>
					</li>
				))}
			</ul>

			<SubmitAnswer
				onSubmit={handleSubmit}
				isDisabled={isSaving || !selectedOption || isSaved}
				buttonText={isSaving ? 'Speichert...' : isSaved ? 'Antwort Gespeichert' : 'Antwort speichern'}
			/>
		</div>
	);
}
