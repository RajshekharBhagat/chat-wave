'use client'
import { Menu } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import FriendRequestSideBarOption from "./FriendRequestSideBarOption";
import { Icons } from "./Icons";
import SideBarChatList from "./SideBarChatList";
import SignOutButton from "./SignOutButton";
import { buttonVariants } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { SideBarOption } from "@/app/(dashboard)/dashboard/layout";

interface MobileLayoutProps {
  friends: User[];
  session: Session;
  unseenRequestCount: number;
  className?: string;
}

const MobileLayout = ({
  friends,
  session,
  unseenRequestCount,
  className,
}: MobileLayoutProps) => {
  const sidebarOptions: SideBarOption[] = [
    {
      id: 1,
      name: "Add Friend",
      href: "/dashboard/add",
      icon: "UserPlus",
    },
  ];
  return (
    <div className="md:hidden">
    <Sheet>
      <SheetTrigger >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side={"left"} className="w-[400] min-h-screen bg-neutral-50">
        <SheetHeader>
          <SheetTitle>
            <Link
              href={"/dashboard"}
              className="text-xl text-left md:text-center md:text-2xl lg:text-3xl font-bold"
              >
              Chat<span className="text-orange-500">Wave</span>
            </Link>
          </SheetTitle>
          </SheetHeader>
          <SheetDescription>
            <div className="flex flex-col px-0.5 h-full w-full gap-y-5 overflow-y-auto">
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
          </SheetDescription>
        
      </SheetContent>
    </Sheet>
</div>
  );
};
export default MobileLayout;
