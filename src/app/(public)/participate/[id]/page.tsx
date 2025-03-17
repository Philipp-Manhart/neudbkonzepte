import ParticipantWaitingRoom from "@/components/app-waitingroom-participants";

const state = "waiting";

export default function ParticipationPage(){
  if (state === "waiting"){
    return <ParticipantWaitingRoom/>
  }
}