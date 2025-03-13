import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import EnterPollForm from '@/components/enter-poll-form';

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh]">
			<Card className="max-w-md w-full">
				<CardHeader>
					<CardTitle>Abstimmung beitreten</CardTitle>
					<CardDescription>Geben Sie die Abstimmungs-ID ein</CardDescription>
				</CardHeader>
				<CardContent>
					<EnterPollForm />
				</CardContent>
			</Card>
		</div>
	);
}
