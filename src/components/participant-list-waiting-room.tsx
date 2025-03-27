interface ParticipantWaitingRoomProps {
	questionsCount: number;
	participants: {
		id: number;
		name: string | null;
	}[];
}

export default function ParticipantListWaitingRoom({ questionsCount, participants }: ParticipantWaitingRoomProps) {
	return (
		<>
			<div className="w-full p-4 rounded-lg mb-6">
				<p className="text-lg mb-2">Anzahl Fragen: {questionsCount}</p>
				<p className="text-lg">Teilnehmer bisher: {participants.length}</p>
			</div>

			<div className="w-full">
				<h2 className="text-xl font-semibold mb-3">Teilnehmer:</h2>
				<ul className="border rounded-lg divide-y ">
					{participants.map((participant) => (
						<li key={participant.id} className="px-4 py-3">
							{participant.name || 'Anonym'}
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
