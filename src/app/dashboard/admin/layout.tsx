/** Remove test user and uncomment out getCurrentUser & redirect block after connection to CPanel returns */
import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { User } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminDashboardLayout({
  children,
  }: {
      children: ReactNode;
  }) {

   const user: User = {
  id: "test-admin-id",
  email: "admin@test.com",
  emailVerified: null,
  username: "testadmin",
  firstName: "Test",
  lastName: "Admin",
  displayName: "Test Admin",
  imageUrl: null,
  passwordHash: null,
  role: "ADMIN",
  
  createdAt: new Date(),
  updatedAt: new Date(),
};
    /**
    
    const user = await getCurrentUser();
    if (!user) {
      redirect("/sign-in");
    }
  // block non-admins from accessing page
    if (user.role !== "ADMIN") {
      redirect("/");
    }
     */


  return (<div className="w-full h-full">
    
    {/* Sidebar */}
    <Sidebar isAdmin user={user}/>
    <div className="w-full ml-75">
        {/* Header */}
        <Header/>
        <div className="w-full mt-18.75 p-4"> {children}</div>
    </div>
  </div>
  )  ;
}
