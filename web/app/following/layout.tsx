import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function FollowingLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
}
