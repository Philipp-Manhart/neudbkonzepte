import React from 'react';
import { Button } from '../ui/button';

interface SubmitAnswerProps {
	onSubmit: () => void;
	isDisabled?: boolean;
	buttonText?: string;
}

export default function SubmitAnswer({ onSubmit, isDisabled, buttonText }: SubmitAnswerProps) {
	const handleSubmit = () => {
		onSubmit();
	};

	return (
		<div className="flex justify-center mt-6">
			<Button onClick={handleSubmit} disabled={isDisabled}>
				{buttonText}
			</Button>
		</div>
	);
}
