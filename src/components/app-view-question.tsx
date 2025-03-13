'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionType } from './app-add-question';

interface ViewQuestionProps {
	questionId: number;
	questionType: QuestionType | null;
	questionText: string;
	optionTexts: string[];
}

export default function ViewQuestion({ questionId, questionType, questionText, optionTexts }: ViewQuestionProps) {
	// Helper function to get a readable question type label
	const getQuestionTypeLabel = (type: QuestionType | null): string => {
		if (!type) return 'Nicht festgelegt';

		switch (type) {
			case 'multiple-choice':
				return 'Multiple Choice';
			case 'single-choice':
				return 'Single Choice';
			case 'yes-no':
				return 'Ja / Nein';
			case 'scale':
				return 'Skala';
			default:
				return type;
		}
	};

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Frage {questionId}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-1">Fragentyp</h3>
					<p className="p-2 bg-muted rounded-md">{getQuestionTypeLabel(questionType)}</p>
				</div>

				{questionType && (
					<>
						<div className="space-y-2">
							<h3 className="text-sm font-medium mb-1">Frage</h3>
							<p className="p-2 bg-muted rounded-md whitespace-pre-wrap">
								{questionText || 'Keine Fragestellung angegeben'}
							</p>
						</div>

						{/* Display options based on question type */}
						{(questionType === 'multiple-choice' || questionType === 'single-choice') && optionTexts.length > 0 && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium">Auswahlmöglichkeiten</h3>
								<div className="space-y-1">
									{optionTexts.map((optionText, index) => (
										<div key={index} className="p-2 bg-muted rounded-md">
											{optionText || `Option ${index + 1} (leer)`}
										</div>
									))}
								</div>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
