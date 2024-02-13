import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản trị | Tech News",
};

export default async function AdminPostLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || user?.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
