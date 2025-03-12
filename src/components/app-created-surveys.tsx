//Hier die ganzen Survey Cards mappen
import { SurveyCard } from './app-poll-card';

interface PastSurveysProps {
	surveys: {
		title: string;
		date: string;
		participantCount: number;
		questionCount: number;
	}[];
	onCreatedPage: boolean;
}

export function CreatedSurveys({ surveys, onCreatedPage }: PastSurveysProps) {
	return (
		<>
			{surveys.map((survey, index) => (
				<SurveyCard onCreatedPage={onCreatedPage} key={index} survey={survey} />
			))}
		</>
	);
}
