'use client';
import { Poll } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from '@/components/ui/label';

interface ViewBasicSettingsProps {
	poll: Poll;
}

export default function AppViewBasicSettings({ poll }: ViewBasicSettingsProps) {
	return (
		<Card className="w-full max-w-2xl relative">
			<CardHeader>
				<CardTitle>Allgemeine Einstellungen</CardTitle>
			</CardHeader>
			<CardContent className="space-y-8">
				<div>
					<Label className="mb-2 block">Umfragenname:</Label>
					<p className="p-2 rounded-md">{poll.name}</p>
				</div>
				<div>
					<Label className="mb-2 block">Zeit pro Frage:</Label>
					<div className="p-2  rounded-md">
						<p>{poll.defaultduration} Sekunden pro Frage</p>
					</div>
				</div>
				<div>
					<Label className="mb-2 block">Beschreibung der Umfrage:</Label>
					<div className="p-2 rounded-md min-h-[75px] whitespace-pre-wrap">
						{poll.description || <span className="text-gray-400">Keine Beschreibung vorhanden</span>}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
