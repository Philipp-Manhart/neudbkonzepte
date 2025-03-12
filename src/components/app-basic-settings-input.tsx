'use client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Label } from '@/components/ui/label';

interface BasicSettingsInputProps {
	defaultTime: number[];
	setDefaultTime: (value: number[]) => void;
	description: string;
	setDescription: (value: string) => void;
	pollName: string;
	setPollName: (value: string) => void;
	nameError?: string;
	descriptionError?: string;
}

export default function BasicSettingsInput({
	defaultTime,
	setDefaultTime,
	description,
	setDescription,
	pollName,
	setPollName,
	nameError,
	descriptionError,
}: BasicSettingsInputProps) {
	return (
		<Card className="w-full max-w-2xl relative">
			<CardHeader>
				<CardTitle>Allgemeine Einstellungen</CardTitle>
			</CardHeader>
			<CardContent className="space-y-8">
				<div>
					<Label className="mb-2">Umfragenname:</Label>
					<Input
						type="text"
						className={`w-full border rounded-md ${nameError ? 'border-red-500' : ''}`}
						placeholder={'Beispielname'}
						onChange={(e) => setPollName(e.target.value)}
						value={pollName}
					/>
					{nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
				</div>
				<div>
					<Label className="mb-2">Zeit pro Frage:</Label>

					<div className="flex items-center justify-center py-2">
						<Slider value={defaultTime} max={300} min={10} step={5} onValueChange={(val) => setDefaultTime(val)} />
					</div>
					<div className="flex items-center justify-center">
						<p>{defaultTime} Sekunden pro Frage</p>
					</div>
				</div>
				<div className="items-center justify-center">
					<Label className="mb-2">Beschreibung der Umfrage:</Label>
					<textarea
						className={`w-full p-2 border rounded-md ${descriptionError ? 'border-red-500' : ''}`}
						rows={3}
						placeholder="Gib hier deine Beschreibung ein"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					{descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
				</div>
			</CardContent>
		</Card>
	);
}
