'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionData, QuestionType } from '@/lib/definitions';

interface ViewQuestionProps {
	question: QuestionData;
}

export default function ViewQuestion({ question }: ViewQuestionProps) {
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
				<CardTitle>Frage {question.questionId}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<h3 className="text-sm font-medium mb-1">Fragentyp</h3>
					<p className="p-2 rounded-md">{getQuestionTypeLabel(question.type)}</p>
				</div>

				{question.questionText && (
					<>
						<div className="space-y-2">
							<h3 className="text-sm font-medium mb-1">Frage</h3>
							<p className="p-2 rounded-md whitespace-pre-wrap">
								{question.questionText || 'Keine Fragestellung angegeben'}
							</p>
						</div>

						{/* Display options based on question type */}
						{(question.type === 'multiple-choice' || question.type === 'single-choice') && question.options.length > 0 && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium">Auswahlmöglichkeiten</h3>
								<div className="space-y-1">
									{question.options?.map((optionText, index) => (
										<div key={index} className="p-2 rounded-md">
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
