import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SubmissionClient from "./SubmissionClient";

export default async function SubmissionPage() {
  const cookieStore = await cookies();
  const signupSuccess = cookieStore.has("signup_success");

  if (!signupSuccess) {
    redirect("/login");
  }

  return <SubmissionClient />;
}
