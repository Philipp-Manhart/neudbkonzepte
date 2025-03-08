import ExampleClientComponent from '@/components/test';

export default function Dashboard() {
	return (
		<div className="flex flex-col items-center pt-[25vh]">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			<p className="text-lg">Willkommen im Dashboard!</p>
			<p className="text-lg">Hier können Sie Ihre Daten verwalten.</p>

			<ExampleClientComponent />
		</div>
	);
}
