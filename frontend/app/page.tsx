import { redirect } from "next/navigation";
export default function Home({}) {
  // TODO: @karwi add redirection authentication logic here
  // if authenticated, go to dashboard
  // else go to auth page
  redirect("/dashboard");
}
