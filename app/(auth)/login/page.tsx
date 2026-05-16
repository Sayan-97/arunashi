import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[486px] p-10 space-y-7 bg-secondary">
        <div className="text-center space-y-3">
          <h1>Welcome back</h1>
          <p className="w-3/4 mx-auto text-secondary-foreground">
            Sign in to access your exclusive Arunashi retailer experience
          </p>
        </div>
        <div className="space-y-5.5">
          <Input
            placeholder="Email"
            className="w-full h-[57px] rounded-none border-0"
          />
          <Input
            placeholder="Password"
            className="w-full h-[57px] rounded-none border-0"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="lg" className="px-10">
              Log In
            </Button>
          </Link>
          <div className="flex items-center justify-between gap-2">
            <div className="w-[52px] h-[2px] bg-foreground" />
            <p>Or</p>
            <div className="w-[52px] h-[2px] bg-foreground" />
          </div>
          <Link href="/signup">
            <Button variant="outline" size="lg">
              Apply for Retailer Access
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
