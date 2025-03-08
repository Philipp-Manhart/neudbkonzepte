//Hier die ganzen Survey Cards mappen
import { SurveyCard } from "./app-survey-profile-card";

interface PastSurveysProps {
	surveys: {
		title: string;
		date: string;
		participantCount: number;
		questionCount: number;
	}[];
}

export function PastSurveys({ surveys }: PastSurveysProps) {
	return (
		<>
			{surveys.map((survey, index) => (
				<SurveyCard key={index} survey={survey} />
			))}
		</>
	);
}