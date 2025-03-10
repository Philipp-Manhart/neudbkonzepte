'use client';

import { useState } from 'react';
import AddQuestion from '@/components/app-add-question';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import PollNameInput from '@/components/app-enter-poll-name';
import { useUser } from '@/lib/context';
import { createPoll } from '@/app/actions/poll';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
	const { userId } = useUser();
	const [questions, setQuestions] = useState([1]);
	const router = useRouter();
	const [defaultTime, setDefaultTime] = useState([3]);
	const [description, setDescription] = useState('');
	const [pollName, setPollName] = useState('');
	const [nameError, setNameError] = useState('');
	const [descriptionError, setDescriptionError] = useState('');

	const addNewQuestion = () => {
		setQuestions([...questions, questions.length + 1]);
	};

	const removeQuestion = (idToRemove: number) => {
		setQuestions(questions.filter((id) => id !== idToRemove));
	};

	async function handleSave() {
		let isValid = true;

		setNameError('');
		setDescriptionError('');

		if (!pollName.trim()) {
			setNameError('Bitte gib einen Namen für die Umfrage ein.');
			isValid = false;
		}

		if (!description.trim()) {
			setDescriptionError('Bitte gib eine Beschreibung für die Umfrage ein.');
			isValid = false;
		}

		if (isValid) {
			await createPoll(userId as string, pollName, description, defaultTime[0].toString());
			router.push('/dashboard');
		}
	}

	return (
		<div className="flex flex-col items-center gap-8 py-10 px-4">
			<p className="text-5xl">Erstelle eine neue Umfrage.</p>
			<PollNameInput
				defaultTime={defaultTime}
				setDefaultTime={setDefaultTime}
				description={description}
				setDescription={setDescription}
				pollName={pollName}
				setPollName={setPollName}
				nameError={nameError}
				descriptionError={descriptionError}
			/>
			<p className="text-3xl">Füge hier Fragen hinzu.</p>
			{questions.map((id) => (
				<div key={id} className="w-full max-w-2xl">
					<AddQuestion questionId={id} onRemove={removeQuestion} canRemove={questions.length > 1} />
				</div>
			))}

			<Button onClick={addNewQuestion} variant="outline" className="flex items-center gap-2 mt-4 max-w-2xl w-full">
				<PlusCircle className="h-5 w-5" />
				Neue Frage hinzufügen
			</Button>
			<Button onClick={handleSave}>Umfrage speichern</Button>
		</div>
	);
}
