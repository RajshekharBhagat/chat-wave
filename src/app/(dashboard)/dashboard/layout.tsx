import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import FriendRequestSideBarOption from "@/components/FriendRequestSideBarOption";
import { Icon, Icons } from "@/components/Icons";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import MobileLayout from "@/components/MobileLayout";
import SideBarChatList from "@/components/SideBarChatList";
import SignOutButton from "@/components/SignOutButton";
import { buttonVariants } from "@/components/ui/button";
import { User, getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { getFriendsByUserId } from "../../../../helper/getFriendsByUserId";
import { fetchRedis } from "../../../../helper/redis";

interface LayoutProps {
  children: ReactNode;
}
export interface SideBarOption {
  id: number;
  name: string;
  href: string;
  icon: Icon;
}
const sidebarOptions: SideBarOption[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    icon: "UserPlus",
  },
];

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return notFound();
  }

  const friends = await getFriendsByUserId(session.user.id);

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  return (
    <MaxWidthWrapper>
      <div className="w-full h-[calc(100vh-20px)] flex">
        <div className="hidden md:flex border-r-2 px-2 py-2 border-orange-100 h-full w-full max-w-72 grow flex-col gap-y-5 overflow-y-auto bg-neutral-50">
          <Link
            href={"/dashboard"}
            className="text-xl text-left md:text-center md:text-2xl lg:text-3xl font-bold"
          >
            Chat<span className="text-orange-500">Wave</span>
          </Link>
          {friends.length > 0 ? (
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Your chats
            </div>
          ) : null}
          <nav className="flex flex-col flex-1">
            <ul role="list" className="flex flex-col flex-1 gap-y-4">
              <li>
                <SideBarChatList
                  sessionId={session.user.id}
                  friends={friends}
                />
              </li>
              <li>
                <div className="font-semibold text-xs text-gray-400">
                  Overview
                </div>
                <ul role="list" className="mt-2 space-y-1">
                  {sidebarOptions.map((option) => {
                    const Icon = Icons[option.icon];
                    return (
                      <li key={option.id}>
                        <Link
                          href={option.href}
                          className={buttonVariants({
                            variant: "ghost",
                            class:
                              "w-full group flex items-center justify-items-start border border-gray-300 hover:translate-x-0.5 transition-transform duration-300 gap-2 p-2 rounded-lg shadow-sm hover:shadow-md",
                          })}
                        >
                          <Icon className="w-5 h-5 text-slate-900 mr-2 group-hover:text-orange-500 transition-colors ease-in-out duration-300" />
                          <span className="truncate text-slate-900 group-hover:text-orange-500 transition-colors ease-in-out duration-300">
                            {option.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li>
                <FriendRequestSideBarOption
                  sessionId={session.user.id}
                  initialUnseenRequestCount={unseenRequestCount}
                />
              </li>
              {/* <li>
                <CreateRoomButton sessionId={session.user.id} />
              </li> */}
              <li className="mt-auto flex flex-col">
                <div className="flex border-t-2 border-orange-200 py-2 items-center">
                  <div className="relative shrink-0 w-8 h-8">
                    <Image
                      fill
                      src={session.user.image!}
                      className="rounded-full"
                      referrerPolicy="no-referrer"
                      alt="Profile Image"
                    />
                  </div>
                  <div className="ml-1.5 flex flex-col">
                    <span>
                      <h1 className="text-xs font-semibold truncate text-zinc-900">
                        {session.user.name}
                      </h1>
                    </span>
                    <span>
                      <h1 className="text-xs truncate text-zinc-500">
                        {session.user.email}
                      </h1>
                    </span>
                  </div>
                  <SignOutButton />
                </div>
              </li>
            </ul>
          </nav>
        </div>
        <aside className="relative h-full min-h-screen max-w-screen-2xl w-full">
          {children}
        </aside>
      </div>
    </MaxWidthWrapper>
  );
};

export default Layout;