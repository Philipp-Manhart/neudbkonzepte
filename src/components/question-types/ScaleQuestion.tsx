'use client';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import SubmitAnswer from './SubmitAnswer';
import { saveUserAnswer } from '@/app/actions/poll_run';

interface ScaleQuestionProps {
	questionId: string;
	questionText: string;
	onAnswerSelected?: (value: number) => void;
	pollRunId: string;
}

export default function ScaleQuestion({ questionId, questionText, onAnswerSelected, pollRunId }: ScaleQuestionProps) {
	const [sliderValue, setSliderValue] = useState<number>(4); // Default to middle value
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const handleSubmit = async () => {
		try {
			setIsSaving(true);
			await saveUserAnswer(pollRunId, questionId, sliderValue.toString());
		} catch (error) {
			console.error('Error saving answer:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleValueChange = (value: number[]) => {
		const newValue = value[0];
		setSliderValue(newValue);
		if (onAnswerSelected) {
			onAnswerSelected(newValue);
		}
	};

	return (
		<div className="py-4">
			<h3 className="text-xl font-semibold mb-4">{questionText}</h3>

			<Slider min={1} max={7} step={1} value={[sliderValue]} onValueChange={handleValueChange} className="mb-6" />

			<div className="flex justify-between text-sm mt-2">
				<span>1</span>
				<span>2</span>
				<span>3</span>
				<span>4</span>
				<span>5</span>
				<span>6</span>
				<span>7</span>
			</div>

			<div className="text-center mt-4 text-lg font-medium">Selected value: {sliderValue}</div>

			<div className="mt-6">
				<SubmitAnswer
					onSubmit={handleSubmit}
					isDisabled={isSaving}
					buttonText={isSaving ? 'Saving...' : 'Save Answer'}
				/>
			</div>
		</div>
	);
}
