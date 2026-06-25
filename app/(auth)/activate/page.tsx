import { redirect } from "next/navigation";
import { Suspense } from "react";
import CreatePasswordForm from "./CreatePasswordForm";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function CreatePasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login");
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-gray-500">
          Loading form...
        </div>
      }
    >
      <CreatePasswordForm token={token} />
    </Suspense>
  );
}
