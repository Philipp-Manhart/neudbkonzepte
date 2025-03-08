"use client";
import { useState } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from './ui/button';

type QuestionType = 'multiple-choice' | 'text' | 'true-false';

export default function AddQuestion() {
	const [questionType, setQuestionType] = useState<QuestionType | null>(null);

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Add a Question</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<label className="text-sm font-medium mb-2 block">Question Type</label>
					<Select onValueChange={(value: QuestionType) => setQuestionType(value)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select question type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="multiple-choice">Multiple Choice</SelectItem>
							<SelectItem value="text">Text</SelectItem>
							<SelectItem value="true-false">True/False</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{questionType && (
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block">Question</label>
							<textarea className="w-full p-2 border rounded-md" rows={3} placeholder="Enter your question here" />
						</div>

						{/* Different input options based on question type */}
						{questionType === 'multiple-choice' && (
							<div className="space-y-2">
								<p className="text-sm font-medium">Options</p>
								{[1, 2, 3, 4].map((num) => (
									<input
										key={num}
										type="text"
										className="w-full p-2 border rounded-md mb-2"
										placeholder={`Option ${num}`}
									/>
								))}
							</div>
						)}

						{questionType === 'true-false' && (
							<div className="flex gap-4">
								<div className="flex items-center">
									<input type="radio" id="true" name="answer" />
									<label htmlFor="true" className="ml-2">
										True
									</label>
								</div>
								<div className="flex items-center">
									<input type="radio" id="false" name="answer" />
									<label htmlFor="false" className="ml-2">
										False
									</label>
								</div>
							</div>
						)}

						<Button className="w-full">Save Question</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
