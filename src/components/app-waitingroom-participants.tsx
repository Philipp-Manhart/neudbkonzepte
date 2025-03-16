import React from 'react';

// Mock data for participants
const mockParticipants = [
	{ id: 1, name: 'Max Mustermann' },
	{ id: 2, name: 'Anna Schmidt' },
	{ id: 3, name: 'Erika Müller' },
	{ id: 4, name: null }, // Anonymous participant
	{ id: 5, name: 'Thomas Weber' },
	{ id: 6, name: null }, // Anonymous participant
];

// Mock number of questions
const mockQuestionCount = 12;

interface WaitingRoomParticipantsProps {
	// Props can be added here if needed later
}

export default function ParticipantWaitingRoom() {
	return (
		<div className="flex flex-col items-center p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Warte hier bevor die Umfrage beginnt</h1>

			<div className="w-full p-4 rounded-lg mb-6">
				<p className="text-lg mb-2">Anzahl Fragen: {mockQuestionCount}</p>
				<p className="text-lg">Teilnehmer bisher: {mockParticipants.length}</p>
			</div>

			<div className="w-full">
				<h2 className="text-xl font-semibold mb-3">Teilnehmer:</h2>
				<ul className="border rounded-lg divide-y ">
					{mockParticipants.map((participant) => (
						<li key={participant.id} className="px-4 py-3">
							{participant.name || 'Anonym'}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
