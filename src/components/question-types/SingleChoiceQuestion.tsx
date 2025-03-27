'use client';
import { useState } from 'react';
import SubmitAnswer from './SubmitAnswer';
import { saveUserAnswer } from '@/app/actions/poll_run';

interface SingleChoiceQuestionProps {
	questionId: string;
	questionText: string;
	options: string[];
	onAnswerSelected?: (value: string) => void;
	pollRunId: string;
}

export default function SingleChoiceQuestion({
	questionId,
	questionText,
	options,
	onAnswerSelected,
	pollRunId,
}: SingleChoiceQuestionProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleSubmit = async () => {
		if (!selectedOption) return;

		try {
			setIsSaving(true);
			await saveUserAnswer(pollRunId, questionId, selectedOption);
		} catch (error) {
			console.error('Error saving answer:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleOptionClick = (option: string) => {
		setSelectedOption(option);
		if (onAnswerSelected) {
			onAnswerSelected(option);
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
							selectedOption === option ? 'bg-amber-100 border-amber-500' : 'hover:bg-gray-50'
						}`}>
						<div className="flex items-center">
							<div
								className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
									selectedOption === option ? 'border-amber-500' : 'border-gray-400'
								}`}>
								{selectedOption === option && <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
							</div>
							<span>{option}</span>
						</div>
					</li>
				))}
			</ul>

			<div className="mt-4">
				<SubmitAnswer
					onSubmit={handleSubmit}
					isDisabled={isSaving || !selectedOption}
					buttonText={isSaving ? 'Saving...' : 'Save Answer'}
				/>
			</div>
		</div>
	);
}
