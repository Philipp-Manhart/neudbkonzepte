import ExampleClientComponent from '@/components/test';
import { PastSurveys } from '@/components/app-past-surveys';

const surveysData = [
	{
		title: 'Customer Satisfaction Survey',
		date: '2025-02-15',
		participantCount: 127,
		questionCount: 4,
	},
	{
		title: 'Product Feedback Survey',
		date: '2025-01-20',
		participantCount: 89,
		questionCount: 6,
	},
	{
		title: 'Website Usability Test',
		date: '2024-12-05',
		participantCount: 42,
		questionCount: 5,
	},
	{
		title: 'Employee Engagement Survey',
		date: '2024-11-10',
		participantCount: 31,
		questionCount: 3,
	},
];

export default function Dashboard() {
	return (
		<div className="flex flex-col items-center pt-[25vh]">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p className="text-lg">Willkommen im Dashboard!</p>
			<p className="text-lg">Hier können Sie Ihre Daten verwalten.</p>

			<ExampleClientComponent />
			<div className="container mx-auto flex flex-col items-center py-10">
				<h3 className="text-bold text-4xl pb-6 text-center">Umfragen, die du erstellt hast</h3>
				<div className="w-full max-w-4xl">
					<PastSurveys surveys={surveysData} />
				</div>
			</div>
		</div>
	);
}
