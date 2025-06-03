import { db } from "@/lib/dbConnect";
import { fetchSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { fetchRedis } from "../../../../../../helper/redis";
import { messageArrayValidator } from "@/schema/Message";
import Image from "next/image";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";
import MobileLayout from "@/components/MobileLayout";
import { getFriendsByUserId } from "../../../../../../helper/getFriendsByUserId";

interface PageProps {
  params: {
    chatId: string;
  };
}
const Page = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await fetchSession();

  if (!session || !session.user) {
    return notFound();
  }

  const friends = await getFriendsByUserId(session.user.id)
  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;
  const { user } = session;

  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) {
    return notFound();
  }

  async function getChatMessages(chatId: string){
    try {
      const result: string[] = await fetchRedis(
        "zrange",
        `chat:${chatId}:messages`,
        0,
        -1
      );
      const dbMessages = result.map(
        (message) => JSON.parse(message) as Message
      );

      const reverseDbMessages = dbMessages.reverse();
      const messages = messageArrayValidator.parse(reverseDbMessages);
      return messages as Message[]
    } catch (error) {
      notFound();
    }
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1;
  const chatPartner = (await db.get(`user:${chatPartnerId}`)) as User;
  const initialMessages = await getChatMessages(chatId);
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-3rem)] justify-between gap-0.5 p-0.5">
      <div className="flex items-center gap-2 py-2 border-b-2 border-orange-200">
        <MobileLayout friends={friends} session={session} unseenRequestCount={unseenRequestCount}/>
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={chatPartner.image!}
                alt={`${chatPartner.name} Profile Picture`}
                className="rounded-full border-2 border-orange-300"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">{chatPartner.name}</span>
            </div>
            <span className="text-sm text-gray-600">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages chatId={chatId} sessionImage={session.user.image!} charPartner={chatPartner} sessionId={session.user.id} initialMessages={initialMessages} />
      <ChatInput chatId={chatId} chatPartner={chatPartner} />
    </div>
  );
};

export default Page;
