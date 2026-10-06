// React, Next.js
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// custom ui components
import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";

// Auth
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";

export default async function SellerStoreDashboardLayout(
    {children}:{children:ReactNode;}
) {

    // Get current user
    const user = await getCurrentUser();
    if (!user) {
               redirect("/");
    };
    
    // Retrieve list of stores associated with the authenticated user.
    const stores = await db.store.findMany({
        where: {
            userId: user.id,
        },
    });

  return (
    <div className="h-full w-full flex" >
        <Sidebar stores={stores} />
        <div className="w-full ml-75">
            <Header />
            <div className="w-full mt-18.75 p-4">{children}</div>
        </div>
    </div>
  )
}
