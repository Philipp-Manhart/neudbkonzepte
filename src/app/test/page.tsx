'use client';

import QuestionVotesChart from '@/components/app-question-votes-chart';
const chartData = [
	{ option: 'Manuel', votes: 3 },
	{ option: 'Bob', votes: 5},
	{ option: 'Micheal', votes: 5 },
	{ option: 'Here', votes: 7 },
	{ option: 'Glory', votes: 4 },
	{ option: 'Save', votes: 1 }, 
];


export default function Page() {
	return (
		<QuestionVotesChart title={"Hier steht die Frage?"} chartData={chartData}/>
	);
}
