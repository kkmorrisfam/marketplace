import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
// import { UserButton } from "@clerk/nextjs";
// import { ThemeProvider } from "next-themes";


export default function Home() {
  return (
  <div className="p-5">
    <div className=" flex gap-x-5 justify-end " >
   
      <ThemeToggle />
    </div>
    <h1 className="font-bold text-blue-500 font-barlow">Welcome to start page.</h1>
        <Button>Click here</Button>
  </div>
  );
}
