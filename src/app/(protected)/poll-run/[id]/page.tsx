import { getPollRun } from "@/app/actions/poll_run";
import { getQuestionsByPollId } from "@/app/actions/question";
import OwnerWaitingRoom from "@/components/app-waitingroom-creator";

const mockParticipants = [
	{ id: 1, name: 'Max Mustermann' },
	{ id: 2, name: 'Anna Schmidt' },
	{ id: 3, name: 'Erika Müller' },
	{ id: 4, name: null }, // Anonymous participant
	{ id: 5, name: 'Thomas Weber' },
	{ id: 6, name: null }, // Anonymous participant
];


export default async function Page({ params }: { params: Promise<{ id: string }> }){
  const { id } = await params;

  const responsePoll = await getPollRun(id);

  const responseQuestions = await getQuestionsByPollId(responsePoll.pollRun?.pollId as string)

  const questionsCount = responseQuestions.questions?.length;

  console.log(questionsCount);

  if (responsePoll.pollRun?.status === "open"){
    return <OwnerWaitingRoom questionsCount={questionsCount as number} participants={mockParticipants} pollRunId={id}/>
  }
}