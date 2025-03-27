'use client';
import { useState } from 'react';
import SubmitAnswer from './SubmitAnswer';
import { saveUserAnswer } from '@/app/actions/poll_run';

interface MultipleChoiceQuestionProps {
	questionId: string;
	questionText: string;
	options: string[];
	onAnswerSelected?: (values: string[]) => void;
	pollRunId: string;
}

export default function MultipleChoiceQuestion({
	questionId,
	questionText,
	options,
	pollRunId,
	onAnswerSelected,
}: MultipleChoiceQuestionProps) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleSubmit = async () => {
		if (selectedOptions.length === 0) return;

		try {
			setIsSaving(true);
			await saveUserAnswer(pollRunId, questionId, JSON.stringify(selectedOptions));
		} catch (error) {
			console.error('Error saving answer:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleOptionClick = (option: string) => {
		let newSelectedOptions: string[];

		if (selectedOptions.includes(option)) {
			// Remove if already selected
			newSelectedOptions = selectedOptions.filter((item) => item !== option);
		} else {
			// Add if not already selected
			newSelectedOptions = [...selectedOptions, option];
		}

		setSelectedOptions(newSelectedOptions);

		if (onAnswerSelected) {
			onAnswerSelected(newSelectedOptions);
		}
	};

	return (
		<div>
			<h3 className="text-xl font-semibold mb-4">{questionText}</h3>

			<ul className="space-y-2">
				{options.map((option, index) => (
					<li
						key={index}
						onClick={() => handleOptionClick(option)}
						className={`border p-3 rounded-md cursor-pointer transition-all ${
							selectedOptions.includes(option) ? 'bg-amber-100 border-amber-500' : 'hover:bg-gray-50'
						}`}>
						<div className="flex items-center">
							<div
								className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${
									selectedOptions.includes(option) ? 'border-amber-500' : 'border-gray-400'
								}`}>
								{selectedOptions.includes(option) && <div className="w-2 h-2 bg-amber-500"></div>}
							</div>
							<span>{option}</span>
						</div>
					</li>
				))}
			</ul>

			{selectedOptions.length > 0 && (
				<div className="mt-4 text-sm text-gray-600">Selected: {selectedOptions.join(', ')}</div>
			)}

			<div className="mt-4">
				<SubmitAnswer
					onSubmit={handleSubmit}
					isDisabled={isSaving || selectedOptions.length === 0}
					buttonText={isSaving ? 'Saving...' : 'Save Answer'}
				/>
			</div>
		</div>
	);
}
