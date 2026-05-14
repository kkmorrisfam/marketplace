import Header from "@/components/dashboard/header/header";
import { ReactNode } from "react";

export default function AdminDashboardLayout({
    children,
    }: {
        children: ReactNode;
    }) {

  // block non-admins from accessing page

  return (<div className="w-full h-full">
    
    {/* Sidebar */}
    <div className="w-full ml-[300px]">
        {/* Header */}
        <Header/>
        <div className="w-full mt-[75px] p-4"> {children}</div>
    </div>
  </div>
  )  ;
}
