"use client";
import { cn, toPusherKey } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";
import { Message } from "@/schema/Message";
interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  sessionImage: string;
  charPartner: User;
  chatId: string;
}

const Messages = ({
  initialMessages,
  sessionId,
  sessionImage,
  charPartner,
  chatId,
}: MessagesProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const formatTimeStamp = (timeStamp: number) => {
    return format(timeStamp, "hh:mm");
  };

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}:messages`));
    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev])
    }
    pusherClient.bind('incomingMessages',messageHandler)
    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat${chatId}:messages`));
      pusherClient.unbind('incomingMessages',messageHandler);
    }
  },[chatId]);

  return (
    <div
      id="messages"
      className="flex h-full w-full flex-1 flex-col-reverse gap-2 md:p-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextMessageFromSameUser =
          index > 0 &&
          messages[index - 1].senderId === messages[index].senderId;
        return (
          <div
            className="chat-Message"
            key={`${message.id}-${message.timeStamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex  flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn(
                    "px-4 py-2 text-zinc-900 rounded-lg inline-block",
                    {
                      "bg-orange-400": isCurrentUser,
                      "bg-gray-200": !isCurrentUser,
                      "rounded-br-none":
                        !hasNextMessageFromSameUser && isCurrentUser,
                      "rounded-bl-none":
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    }
                  )}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-600">
                    {formatTimeStamp(message.timeStamp)}
                  </span>
                </span>
              </div>
              <div
                className={cn("relative w-6 h-6 shrink-0", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImage as string) : charPartner.image
                  }
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full shrink-0"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;


