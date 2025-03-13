'use client';

import { useState } from 'react';
import AddQuestion from '@/components/app-add-question';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save } from 'lucide-react';
//import { useUser } from '@/lib/context';
import { useRouter } from 'next/navigation';
import BasicSettingsInput from '@/components/app-basic-settings-input';
import { updatePoll } from '@/app/actions/poll';
import { updateQuestion, createQuestion, deleteQuestion } from '@/app/actions/question';
import { QuestionData } from '@/lib/definitions';



interface PollDetailsContentProps {
	pollId: string;
	initialPollData: {
		name: string;
		description: string;
		defaultduration: string;
	};
	initialQuestionData: QuestionData[];
}

export default function PollDetailsContent({ pollId, initialPollData, initialQuestionData }: PollDetailsContentProps) {
	//const { userKey } = useUser();
	const router = useRouter();
	const [defaultTime, setDefaultTime] = useState([parseInt(initialPollData.defaultduration)]);
	const [description, setDescription] = useState(initialPollData.description);
	const [pollName, setPollName] = useState(initialPollData.name);
	const [nameError, setNameError] = useState('');
	const [descriptionError, setDescriptionError] = useState('');

	const [questions, setQuestions] = useState<QuestionData[]>(() => {
		console.log('Initial question data:', initialQuestionData);

		return initialQuestionData.map((q) => ({
			questionId: q.questionId,
			type: q.type,
			questionText: q.questionText || '',
			options: q.options || Array(4).fill(''),
			error: null,
		}));
	});

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
		const isValid = validateForm();

		if (isValid) {
			await updatePoll(pollId, pollName, description, defaultTime[0].toString());

			const existingQuestionIds = initialQuestionData.map((q) => q.questionId);
			const currentQuestionIds = questions.map((q) => q.questionId);

			for (const existingId of existingQuestionIds) {
				if (!currentQuestionIds.includes(existingId)) {
					await deleteQuestion(existingId);
				}
			}

			for (const question of questions) {
				if (question.type) {
					if (existingQuestionIds.includes(question.questionId)) {
						await updateQuestion(
							question.questionId,
							question.type,
							question.questionText,
							question.options as string[]
						);
					} else {
						await createQuestion(pollId, question.type, question.questionText, question.options as string[]);
					}
					
				}
			}

			router.push('/my-polls');
		}
	}

	return (
		<div className="flex flex-col items-center gap-6">
			<h1 className="questionText-3xl font-semibold">Umfrage bearbeiten</h1>
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

			<p className="questionText-2xl font-semibold">Fragen:</p>
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
			<Button onClick={handleSave} className="flex items-center gap-2 mb-8">
				<Save className="h-5 w-5" />
				Änderungen speichern
			</Button>
		</div>
	);
}
