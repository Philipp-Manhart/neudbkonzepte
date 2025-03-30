'use client';
import { useState, useEffect } from 'react';
import SubmitAnswer from './SubmitAnswer';
import { saveUserAnswer } from '@/app/actions/poll_run';
import QuestionVotesChart from '@/components/app-question-votes-chart';
import { useCurrentResultsSSE } from '@/hooks/use-current-results-sse';

interface MultipleChoiceQuestionProps {
	questionId: string;
	questionText: string;
	options: string[];
	onAnswerSelected?: (values: string[]) => void;
	pollRunId: string;
	isOwner?: boolean;
}

export default function MultipleChoiceQuestion({
	questionId,
	questionText,
	options,
	pollRunId,
	onAnswerSelected,
	isOwner = false,
}: MultipleChoiceQuestionProps) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	// Use the SSE hook to get real-time results
	const { results, isLoading, error } = useCurrentResultsSSE(pollRunId, questionId);

	// Transform the results data for the chart
	const [chartData, setChartData] = useState(
		options.map((option) => ({
			option,
			votes: 0,
		}))
	);

	// Update chart data when results change
	useEffect(() => {
		if (results) {
			setChartData(
				options.map((option) => ({
					option,
					votes: results[option] || 0,
				}))
			);
		}
	}, [results, options]);

	// Show chart immediately if user is the owner
	if (isOwner || isSaved) {
		return (
			<div className="py-4 px-2 sm:px-0">
				<h3 className="text-xl font-semibold mb-4 text-center sm:text-left">{questionText}</h3>
				{isLoading ? (
					<div className="text-center py-4">Loading results...</div>
				) : (
					<QuestionVotesChart title={questionText} chartData={chartData} />
				)}
				{error && <div className="text-red-500 text-center mt-2">Error loading results: {error}</div>}
			</div>
		);
	}

	const handleSubmit = async () => {
		if (selectedOptions.length === 0) return;

		try {
			setIsSaving(true);
			await saveUserAnswer(pollRunId, questionId, JSON.stringify(selectedOptions));
			setIsSaved(true);
		} catch (error) {
			console.error('Error saving answer:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleOptionClick = (option: string) => {
		// Early return if the answer has already been saved
		if (isSaved) return;

		let newSelectedOptions: string[];

		if (selectedOptions.includes(option)) {
			newSelectedOptions = selectedOptions.filter((item) => item !== option);
		} else {
			newSelectedOptions = [...selectedOptions, option];
		}

		setSelectedOptions(newSelectedOptions);

		if (onAnswerSelected) {
			onAnswerSelected(newSelectedOptions);
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
							selectedOptions.includes(option)
								? 'bg-amber-100 border-amber-500 dark:bg-amber-900/30 dark:border-amber-400'
								: 'hover:bg-gray-50 dark:hover:bg-gray-800'
						} ${isSaved ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
						<div className="flex items-center">
							<div
								className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${
									selectedOptions.includes(option)
										? 'border-amber-500 dark:border-amber-400'
										: 'border-gray-400 dark:border-gray-600'
								}`}>
								{selectedOptions.includes(option) && <div className="w-2 h-2 bg-amber-500 dark:bg-amber-400"></div>}
							</div>
							<span className="text-sm sm:text-base">{option}</span>
						</div>
					</li>
				))}
			</ul>

			<SubmitAnswer
				onSubmit={handleSubmit}
				isDisabled={isSaving || selectedOptions.length === 0 || isSaved}
				buttonText={isSaving ? 'Speichert...' : isSaved ? 'Antwort Gespeichert' : 'Antwort Speichern'}
			/>
		</div>
	);
}
