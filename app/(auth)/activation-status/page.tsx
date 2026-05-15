import { Button } from "@/components/ui/button";

export default function ActivationStatusPage() {
  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[829px] p-10 space-y-7 text-center bg-secondary">
        <h1>Account Activated</h1>
        <p className="text-secondary-foreground text-2xl mx-auto">
          Your account has been successfully set up. You can now access the
          Arunashi Retailer Portal.
        </p>
        <Button variant="outline" size="lg" className="px-10">
          Log In
        </Button>
      </section>
    </div>
  );
}
