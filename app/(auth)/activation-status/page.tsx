import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ActivationStatusClient from "./ActivationStatusClient";

export default async function ActivationStatusPage() {
  const cookieStore = await cookies();
  const activationSuccess = cookieStore.has("activation_success");

  if (!activationSuccess) {
    redirect("/login");
  }

  return <ActivationStatusClient />;
}
