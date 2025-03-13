import { Button } from '@/components/ui/button';
//import { useUser } from '@/lib/context';
import AppViewBasicSettings from './app-view-basic-settings';
import { Poll, QuestionData } from '@/lib/definitions';
import ViewQuestion from './app-view-question';
import Link from 'next/link';



interface PollDetailsContentProps {
  pollData: Poll;
  questionData: QuestionData[];
}

export default function PollViewContent({ pollData, questionData }: PollDetailsContentProps) {
  //const { userKey } = useUser();


  return (
		<div className="flex flex-col items-center gap-6">
			<h1 className="questionText-3xl font-semibold">Umfrage anzeigen</h1>
			<AppViewBasicSettings poll={pollData} />

			<p className="questionText-2xl font-semibold">Fragen:</p>
			{questionData.map((question) => (
				<div key={question.questionId} className="w-full max-w-2xl">
					<ViewQuestion question={question}/>
				</div>
			))}

			<Button className="flex items-center gap-2 mb-8">
				<Link href="/my-polls">Zurück</Link>
			</Button>
		</div>
	);
}
