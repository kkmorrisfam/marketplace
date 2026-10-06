// Auth
import { getCurrentUser } from "@/lib/auth/current-user";

// Database
import { db } from "@/lib/db";

// Next.js
import { redirect } from "next/navigation";


export default async function SellerDashboardPage() {

  //Get current user.  If the user is not logged in, redirect to home page
  const user = await getCurrentUser();
  if (!user) {
            redirect("/sign-in");
  }

  // Get the list of stores associated with the user
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    }
  })

  // if user has no stores, redirect to page to create a new store
  if(stores===0) {
    redirect('/dashboard/seller/stores/new');
    return;  //if redirect doesn't work.
  }

  // if the user has stores, redirect to the dashboard of their first store
  redirect(`/dashboard/seller/stores/${stores[0].url}`)

  return (
    <div>Seller Dashboard</div>
  )
}
