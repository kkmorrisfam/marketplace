import Logo from "@/components/shared/logo";
//import { FC } from "react";
import UserInfo from "./user-info";
import { User } from "@/generated/prisma/client";

interface SidebarProps{
    isAdmin?:boolean;
    user: User;
}

export default function Sidebar({ isAdmin, user }: SidebarProps) {
    
    
    //get the user object/current User
    return <div className="w-75 border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
       <Logo width="100%" height="180px"/>
       <span className="mt-3" />
       <UserInfo user={user} />
    </div>;
}

