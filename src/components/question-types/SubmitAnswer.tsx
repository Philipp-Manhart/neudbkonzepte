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
		<div className="submit-answer-container">
			<Button onClick={handleSubmit} disabled={isDisabled} className="submit-button">
				{buttonText}
			</Button>
		</div>
	);
}
