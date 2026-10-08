

//import { FC } from "react";
import UserInfo from "./user-info";

// Database
import { Store } from "@/generated/prisma/client";

// Custom UI  Components
import Logo from "@/components/shared/logo";
import SidebarNavAdmin from "./nav-admin";
import { adminDashboardSidebarOptions, SellerDashboardSidebarOptions } from "@/constants/data";
import SidebarNavSeller from "./nav-seller";
import { getCurrentUser } from "@/lib/auth/current-user";
import StoreSwitcher from "./store-switcher";


interface SidebarProps{
    isAdmin?:boolean;
    //user: User;
    stores?:Store[]; 
}

export default async function Sidebar({ isAdmin, stores }: SidebarProps) {   
    
    //get the user object/current User
    const user = await getCurrentUser();

    return (
       <div className="w-75 border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
         <Logo width="100%" height="180px"/>
         <span className="mt-3" />
         {user && <UserInfo user={user} />}
         {
            !isAdmin && stores && <StoreSwitcher stores={stores} />
         }
         
         {isAdmin ? <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} /> : <SidebarNavSeller menuLinks={SellerDashboardSidebarOptions}/>}
        </div>
    );
}

