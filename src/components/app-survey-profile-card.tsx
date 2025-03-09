'use client';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, UsersIcon, BarChart2Icon, PlayIcon, EditIcon } from 'lucide-react';
import { Button } from './ui/button';

interface SurveyCardProps {
	survey: {
		title: string;
		date: string;
		participantCount: number;
		questionCount: number;
	};
	onCreatedPage: boolean;
}

export function SurveyCard({ survey, onCreatedPage }: SurveyCardProps) {
	return (
		<Card className="w-full max-w-3xl mb-4">
			<CardHeader>
				<div className="flex justify-between items-start w-full">
					<div>
						<h2 className="text-2xl font-bold">{survey.title}</h2>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-2">
					<CalendarIcon className="h-4 w-4 text-muted-foreground" />
					<label className="text-base font-medium text-muted-foreground">Datum:</label>
					<p className="text-lg">{survey.date}</p>
				</div>
				<div className="flex items-center gap-2">
					<UsersIcon className="h-4 w-4 text-muted-foreground" />
					<label className="text-base font-medium text-muted-foreground">Teilnehmer:</label>
					<p className="text-lg">{survey.participantCount}</p>
				</div>
				<div className="flex items-center gap-2">
					<UsersIcon className="h-4 w-4 text-muted-foreground" />
					<label className="text-base font-medium text-muted-foreground">Anzahl Fragen:</label>
					<p className="text-lg">{survey.questionCount}</p>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end pt-2 gap-2">
				{onCreatedPage ? (
					<>
						<Button className="flex items-center gap-2">
							<PlayIcon className="h-4 w-4" />
							Umfrage Durchführen
						</Button>
						<Button variant="outline" className="flex items-center gap-2">
							<EditIcon className="h-4 w-4" />
							Umfrage bearbeiten
						</Button>
					</>
				) : (
					<Button className="flex items-center gap-2">
						<BarChart2Icon className="h-4 w-4" />
						Ergebnisse anschauen
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
