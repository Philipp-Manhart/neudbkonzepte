import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import EnterPollForm from '@/components/enter-poll-form';

export default function Home() {
	return (
		<div className="flex flex-col items-center pt-[25vh]">
			<Card className="mx-w-auto py-6 px-4">
				<CardHeader>
					<CardTitle>Abstimmung beitreten</CardTitle>
					<CardDescription>Geben Sie die Abstimmungs-ID ein</CardDescription>
				</CardHeader>
				<EnterPollForm />
			</Card>
		</div>
	);
}
