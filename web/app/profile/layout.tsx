import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
}
