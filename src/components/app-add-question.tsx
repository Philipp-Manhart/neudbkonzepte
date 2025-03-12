'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from './ui/button';
import { MinusCircle, PlusCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Label } from '@/components/ui/label';


export type QuestionType = 'multiple-choice' | 'single-choice' | 'yes-no' | 'scale';

interface AddQuestionProps {
	questionId: number;
	onRemove: (id: number) => void;
	canRemove: boolean;
	questionType: QuestionType | null;
	setQuestionType: (questionType: QuestionType) => void;
	questionText: string;
	setQuestionText: (questionText: string) => void;
	optionTexts: string[];
	setOptionTexts: (optionTexts: string[]) => void;
	error: string | null;
}

export default function AddQuestion({
	questionId,
	onRemove,
	canRemove,
	questionType,
	setQuestionType,
	questionText,
	setQuestionText,
	optionTexts,
	setOptionTexts,
	error,
}: AddQuestionProps) {
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
					<Label className="mb-2">Fragentyp</Label>
					<Select onValueChange={(value: QuestionType) => setQuestionType(value)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Fragetyp auswählen" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="multiple-choice">Multiple Choice</SelectItem>
							<SelectItem value="single-choice">Single Choice</SelectItem>
							<SelectItem value="yes-no">Ja / Nein</SelectItem>
							<SelectItem value="scale">Skala</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{questionType && (
					<>
						<div className="space-y-4">
							<Label className="mb-2">Frage</Label>
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
								<Label className="mb-2">Auswahlmöglichkeiten</Label>
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
					</>
				)}
			</CardContent>
		</Card>
	);
}
