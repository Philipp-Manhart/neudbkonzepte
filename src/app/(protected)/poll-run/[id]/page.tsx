import OwnerWaitingRoom from "@/components/app-waitingroom-creator";

const status = "waiting";

export default function OwnerPollRunPage(){
  if (status === "waiting"){
    return <OwnerWaitingRoom/>
  }
}