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
import { GoogleAnalytics } from "@next/third-parties/google";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { FeedbackModal } from "@/components/FeedbackModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech News",
  description: "Tổng hợp tin tức công nghệ mới nhất từ các trang tin tức uy tín",
  icons: [
    {
      url: "/public/icon.png",
      href: "/public/icon.png",
      rel: "icon",
      type: "image/x-icon",
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" data-theme="dark">
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
          <FeedbackModal />
          <LoginModal />
          <RegisterModal />
        </body>
      </SessionProvider>
      <GoogleAnalytics gaId="G-EXTZ9WL2XQ" />
    </html>
  );
}
