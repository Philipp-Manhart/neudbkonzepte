import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Slider } from './ui/slider';

interface PollNameInputProps {
	defaultTime: number[];
	setDefaultTime: (value: number[]) => void;
	description: string;
	setDescription: (value: string) => void;
	pollName: string;
	setPollName: (value: string) => void;
	nameError?: string;
	descriptionError?: string;
}

export default function PollNameInput({
	defaultTime,
	setDefaultTime,
	description,
	setDescription,
	pollName,
	setPollName,
	nameError,
	descriptionError,
}: PollNameInputProps) {
	return (
		<Card className="w-full max-w-2xl relative">
			<CardHeader>
				<p className="text-2xl">Allgemeine Einstellungen:</p>
			</CardHeader>
			<CardContent>
				<p className="py-3">Umfragenname:</p>
				<Input
					type="text"
					className={`w-full border rounded-md ${nameError ? 'border-red-500' : ''}`}
					placeholder={'Beispielname'}
					onChange={(e) => setPollName(e.target.value)}
					value={pollName}
				/>
				{nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}

				<p className="py-3 pb-5">Zeit pro Frage:</p>
				<div className="flex items-center justify-center py-5">
					<Slider value={defaultTime} max={7} min={1} step={1} onValueChange={(val) => setDefaultTime(val)} />
				</div>
				<div className="flex items-center justify-center">
					<p>{defaultTime} Minuten pro Frage</p>
				</div>
				<div className="items-center justify-center">
					<p className="py-3">Beschreibung der Umfrage:</p>

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
