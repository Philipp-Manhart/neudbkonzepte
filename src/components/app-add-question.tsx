'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from './ui/button';
import { MinusCircle, PlusCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

type QuestionType = 'multiple-choice' | 'single-choice' | 'true-false' | 'scale';

interface AddQuestionProps {
	questionId: number;
	onRemove: (id: number) => void;
	canRemove: boolean;
}

export default function AddQuestion({ questionId, onRemove, canRemove }: AddQuestionProps) {
	const [questionType, setQuestionType] = useState<QuestionType | null>(null);
	const [questionText, setQuestionText] = useState('');
	const [optionTexts, setOptionTexts] = useState<string[]>(Array(4).fill(''));
	const [error, setError] = useState<string | null>(null);

	const removeOption = (index: number) => {
		const newOptions = optionTexts.filter((_, i) => i !== index);
		setOptionTexts(newOptions);
	};

	const addOption = () => {
		setOptionTexts([...optionTexts, '']);
	};

	const handleOptionChange = (index: number, value: string) => {
		const newOptionTexts = [...optionTexts];
		newOptionTexts[index] = value;
		setOptionTexts(newOptionTexts);
	};

	const validateForm = () => {
		setError(null);

		if (!questionText.trim()) {
			setError('Bitte geben Sie eine Frage ein.');
			return false;
		}

		if (questionType === 'multiple-choice' || questionType === 'single-choice') {
			const emptyOptions = optionTexts.some((option) => !option.trim());
			if (emptyOptions) {
				setError('Bitte füllen Sie alle Auswahlmöglichkeiten aus.');
				return false;
			}
		}

		return true;
	};

	return (
		<Card className="w-full max-w-2xl relative">
			{canRemove && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-2 right-2 h-8 w-8"
					onClick={() => onRemove(questionId)}
					aria-label="Remove question">
					<X className="h-4 w-4" />
				</Button>
			)}
			<CardHeader>
				<CardTitle>Frage hinzufügen</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<label className="text-sm font-medium mb-2 block">Fragentyp</label>
					<Select onValueChange={(value: QuestionType) => setQuestionType(value)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Fragetyp auswählen" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="multiple-choice">Multiple Choice</SelectItem>
							<SelectItem value="single-choice">Single Choice</SelectItem>
							<SelectItem value="true-false">Wahr oder Falsch</SelectItem>
							<SelectItem value="scale">Skala</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{questionType && (
					<div className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div>
							<label className="text-sm font-medium mb-2 block">Frage</label>
							<textarea
								className="w-full p-2 border rounded-md"
								rows={3}
								placeholder="Gib hier deine Frage ein"
								value={questionText}
								onChange={(e) => setQuestionText(e.target.value)}
							/>
						</div>

						{/* Different input options based on question type */}
						{(questionType === 'multiple-choice' || questionType === 'single-choice') && (
							<div className="space-y-2">
								<p className="text-sm font-medium">Auswahlmöglichkeiten</p>
								{optionTexts.map((optionText, index) => (
									<div key={index} className="flex items-center gap-2 mb-2">
										<input
											type="text"
											className="w-full p-2 border rounded-md"
											placeholder={`Option ${index + 1}`}
											value={optionText}
											onChange={(e) => handleOptionChange(index, e.target.value)}
										/>
										<Button
											size="icon"
											type="button"
											onClick={() => removeOption(index)}
											disabled={optionTexts.length <= 2}>
											<MinusCircle />
										</Button>
									</div>
								))}
								<Button variant="outline" className="w-full" onClick={addOption} type="button">
									<PlusCircle className="mr-2 h-4 w-4" /> Option hinzufügen
								</Button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
