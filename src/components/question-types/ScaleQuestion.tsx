'use client';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import SubmitAnswer from './SubmitAnswer';
import { saveUserAnswer } from '@/app/actions/poll_run';
import QuestionVotesChart from '@/components/app-question-votes-chart';

interface ScaleQuestionProps {
	questionId: string;
	questionText: string;
	onAnswerSelected?: (value: number) => void;
	pollRunId: string;
	isOwner?: boolean;
}

export default function ScaleQuestion({
	questionId,
	questionText,
	onAnswerSelected,
	pollRunId,
	isOwner = false,
}: ScaleQuestionProps) {
	const [sliderValue, setSliderValue] = useState<number>(4); // Default to middle value
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState<boolean>(false);

	// Mock data for the chart - scale questions show distribution of ratings
	const mockChartData = [
		{ option: '1', votes: 2 },
		{ option: '2', votes: 3 },
		{ option: '3', votes: 5 },
		{ option: '4', votes: 8 },
		{ option: '5', votes: 6 },
		{ option: '6', votes: 4 },
		{ option: '7', votes: 3 },
	];

	// Show chart immediately if user is the owner
	if (isOwner || isSaved) {
		return (
			<div className="py-4 px-2 sm:px-0">
				<h3 className="text-xl font-semibold mb-4 text-center sm:text-left">{questionText}</h3>
				<QuestionVotesChart title={questionText} chartData={mockChartData} />
			</div>
		);
	}

	// Rest of the component for participants
	const handleSubmit = async () => {
		try {
			setIsSaving(true);
			await saveUserAnswer(pollRunId, questionId, sliderValue.toString());
			setIsSaved(true);
		} catch (error) {
			console.error('Error saving answer:', error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleValueChange = (value: number[]) => {
		// Prevent changes if answer is already saved
		if (isSaved) return;

		const newValue = value[0];
		setSliderValue(newValue);
		if (onAnswerSelected) {
			onAnswerSelected(newValue);
		}
	};

	return (
		<div className="py-4 px-2 sm:px-0">
			<h3 className="text-xl font-semibold mb-4 text-center sm:text-left">{questionText}</h3>

			<div className="max-w-md mx-auto sm:mx-0">
				<Slider
					min={1}
					max={7}
					step={1}
					value={[sliderValue]}
					onValueChange={handleValueChange}
					className={`mb-6 ${isSaved ? 'opacity-80 pointer-events-none' : ''}`}
					disabled={isSaved}
				/>

				<div className="flex justify-between text-sm mt-2 px-1">
					<span>1</span>
					<span>2</span>
					<span>3</span>
					<span>4</span>
					<span>5</span>
					<span>6</span>
					<span>7</span>
				</div>
			</div>

			<SubmitAnswer
				onSubmit={handleSubmit}
				isDisabled={isSaving || isSaved}
				buttonText={isSaving ? 'Speichert...' : isSaved ? 'Antwort Gespeichert' : 'Antwort Speichern'}
			/>
		</div>
	);
}
