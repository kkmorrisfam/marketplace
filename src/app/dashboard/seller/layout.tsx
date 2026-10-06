
import { getCurrentUser } from "@/lib/auth/current-user";
import { redirect } from "next/navigation";
import { ReactNode } from "react"


export default async function SellerDashboardLayout({
    children,
}: {
    children: ReactNode;
}
) {
     // Block non sellers from accessing seller dashboard\
    const user = await getCurrentUser();
    // check to see if a user was returned, if not, send to sign in page
    if (!user) {
          redirect("/sign-in");
    }
    //if user is not a seller or admin, return to home page
    if (user.role !== "SELLER") {
          redirect("/");
        }

    

  return (
    <div> {children} </div>
  )
}
