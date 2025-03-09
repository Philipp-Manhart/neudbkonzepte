'use client';

import { useState } from 'react';
import AddQuestion from '@/components/app-add-question';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function CreatePage() {
	const [questions, setQuestions] = useState([1]);

	const addNewQuestion = () => {
		setQuestions([...questions, questions.length + 1]);
	};

	const removeQuestion = (idToRemove: number) => {
		setQuestions(questions.filter((id) => id !== idToRemove));
	};

	return (
		<div className="flex flex-col items-center gap-8 py-10 px-4">
			<p className='text-3xl'>Füge hier Fragen hinzu.</p>
			{questions.map((id) => (
				<div key={id} className="w-full max-w-2xl">
					<AddQuestion questionId={id} onRemove={removeQuestion} canRemove={questions.length > 1} />
				</div>
			))}

			<Button onClick={addNewQuestion} variant="outline" className="flex items-center gap-2 mt-4 max-w-2xl w-full">
				<PlusCircle className="h-5 w-5" />
				Neue Frage hinzufügen
			</Button>
		</div>
	);
}
