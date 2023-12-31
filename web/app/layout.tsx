import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { LoginModal } from "@/components/LoginModal";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "react-hot-toast";
import { RegisterModal } from "@/components/RegisterModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech News",
  description: "All the latest tech news in one convenient place.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={`${inter.className} flex flex-col min-h-screen min-w-fit no-scrollbar`}>
          <div className="z-[10000]">
            <Toaster />
          </div>
          <NavBar />
          <div className="flex flex-1">
            <SideBar />
            <div className="lg:pl-60 bg-bg-primary flex-1">{children}</div>
          </div>
          <LoginModal />
          <RegisterModal />
        </body>
      </SessionProvider>
    </html>
  );
}
