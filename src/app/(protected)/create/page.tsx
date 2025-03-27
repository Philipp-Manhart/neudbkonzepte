'use client';

import { useState } from 'react';
import AddQuestion from '@/components/app-add-question';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useUser } from '@/lib/context';
import { createPoll } from '@/app/actions/poll';
import { useRouter } from 'next/navigation';
import BasicSettingsInput from '@/components/app-basic-settings-input';
import { QuestionData } from '@/lib/definitions';
import { createQuestion } from '@/app/actions/question';

export default function CreatePage() {
	const { userKey } = useUser();
	const router = useRouter();
	const [defaultTime, setDefaultTime] = useState([60]);
	const [description, setDescription] = useState('');
	const [pollName, setPollName] = useState('');
	const [nameError, setNameError] = useState('');
	const [descriptionError, setDescriptionError] = useState('');
	const [questions, setQuestions] = useState<QuestionData[]>([
		{
			questionId: "1",
			type: null,
			questionText: '',
			options: Array(4).fill(''),
			error: null,
		},
	]);
	const [isSubmitting, setIsSubmitting] =useState<boolean>(false);

	const validateForm = () => {
		let isValid = true;
		let updatedQuestions = [...questions];

		setNameError('');
		setDescriptionError('');

		updatedQuestions = updatedQuestions.map((question) => {
			let questionIsValid = true;
			let questionError = null;

			if (!question.questionText.trim()) {
				questionError = 'Bitte geben Sie eine Frage ein.';
				questionIsValid = false;
			} else if (
				(question.type === 'multiple-choice' || question.type === 'single-choice') &&
				question.options?.some((option) => !option.trim())
			) {
				questionError = 'Bitte füllen Sie alle Auswahlmöglichkeiten aus.';
				questionIsValid = false;
			}

			if (!questionIsValid) {
				isValid = false;
			}

			return { ...question, error: questionError };
		});

		if (!pollName.trim()) {
			setNameError('Bitte gib einen Namen für die Umfrage ein.');
			isValid = false;
		}

		if (!description.trim()) {
			setDescriptionError('Bitte gib eine Beschreibung für die Umfrage ein.');
			isValid = false;
		}

		setQuestions(updatedQuestions);
		return isValid;
	};

	const addNewQuestion = () => {
			const newId = `new-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
			setQuestions([
				...questions,
				{
					questionId: newId,
					type: null,
					questionText: '',
					options: Array(4).fill(''),
					error: null,
				},
			]);
		};
	
		const removeQuestion = (idToRemove: string) => {
			setQuestions(questions.filter((question) => question.questionId !== idToRemove));
		};
	
		const updateQuestionComponent = (questionId: string, updatedData: Partial<QuestionData>) => {
			setQuestions(questions.map((q) => (q.questionId === questionId ? { ...q, ...updatedData } : q)));
		};

	async function handleSave() {

		setIsSubmitting(true);
		const isValid = validateForm();

		if (isValid) {
			const newPoll = await createPoll(userKey as string, pollName, description, defaultTime[0].toString());

			for (const question of questions) {
				if (question.type) {
					await createQuestion(newPoll.pollId as string, question.type, question.questionText, question.options as string[]);
				}
			}
			router.push('/my-polls');
		}
		setIsSubmitting(false);
	}

	return (
		<div className="flex flex-col items-center gap-6">
			<h1 className="questionText-3xl font-semibold">Erstelle eine neue Umfrage:</h1>
			<BasicSettingsInput
				defaultTime={defaultTime}
				setDefaultTime={setDefaultTime}
				description={description}
				setDescription={setDescription}
				pollName={pollName}
				setPollName={setPollName}
				nameError={nameError}
				descriptionError={descriptionError}
			/>

			<p className="questionText-2xl font-semibold">Füge Fragen hinzu:</p>
			{questions.map((question) => (
				<div key={question.questionId} className="w-full max-w-2xl">
					<AddQuestion
						questionId={question.questionId}
						onRemove={removeQuestion}
						canRemove={questions.length > 1}
						questionType={question.type}
						setQuestionType={(type) => updateQuestionComponent(question.questionId, { type })}
						questionText={question.questionText}
						setQuestionText={(questionText) => updateQuestionComponent(question.questionId, { questionText })}
						optionTexts={question.options as string[]}
						setOptionTexts={(options) => updateQuestionComponent(question.questionId, { options })}
						error={question.error}
					/>
				</div>
			))}

			<Button onClick={addNewQuestion} variant="outline" className="flex items-center gap-2 mt-4 max-w-2xl w-full">
				<PlusCircle className="h-5 w-5" />
				Neue Frage hinzufügen
			</Button>
			<Button onClick={handleSave} disabled={isSubmitting}>Umfrage speichern</Button>
		</div>
	);
}
