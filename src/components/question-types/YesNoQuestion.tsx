'use client';
import { useState } from 'react';
import SubmitAnswer from './SubmitAnswer';
import { saveUserAnswer } from '@/app/actions/poll_run';

interface YesNoQuestionProps {
	questionId: string;
	questionText: string;
	onAnswerSelected?: (value: string) => void;
	pollRunId: string;
}

export default function YesNoQuestion({ questionId, questionText, onAnswerSelected, pollRunId }: YesNoQuestionProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleSubmit = async () => {
		if (!selectedOption) return;

		try {
			setIsSaving(true);
			await saveUserAnswer(pollRunId, questionId, selectedOption as string);
		} catch (error) {
			console.error('Error saving answer:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleOptionClick = (option: 'Yes' | 'No') => {
		setSelectedOption(option);
		if (onAnswerSelected) {
			onAnswerSelected(option);
		}
	};

	return (
		<div>
			<h3 className="text-xl font-semibold mb-4">{questionText}</h3>

			<div className="flex space-x-4 justify-center mt-4">
				<button
					onClick={() => handleOptionClick('Yes')}
					className={`px-8 py-4 rounded-lg border-2 transition-all ${
						selectedOption === 'Yes' ? 'bg-green-500 text-white border-green-600' : 'border-gray-300 hover:bg-gray-50'
					}`}>
					Yes
				</button>

				<button
					onClick={() => handleOptionClick('No')}
					className={`px-8 py-4 rounded-lg border-2 transition-all ${
						selectedOption === 'No' ? 'bg-red-500 text-white border-red-600' : 'border-gray-300 hover:bg-gray-50'
					}`}>
					No
				</button>
			</div>
			<SubmitAnswer
				onSubmit={handleSubmit}
				isDisabled={isSaving || !selectedOption}
				buttonText={isSaving ? 'Saving...' : 'Save Answer'}
			/>
		</div>
	);
}
