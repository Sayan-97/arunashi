import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreatePasswordPage() {
  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[486px] p-10 flex flex-col gap-7 bg-secondary">
        <div className="text-center space-y-3">
          <h1>Create a password</h1>
          <p className="w-3/4 mx-auto text-secondary-foreground">
            Create a secure password to access your Arunashi retailer account
          </p>
        </div>
        <div className="space-y-5.5">
          <Input
            placeholder="Enter your password"
            className="w-full h-[57px] rounded-none border-0"
          />
          <Input
            placeholder="Re-enter your password"
            className="w-full h-[57px] rounded-none border-0"
          />
        </div>
        <Button variant="outline" size="lg" className="px-10 self-center">
          Submit
        </Button>
      </section>
    </div>
  );
}
