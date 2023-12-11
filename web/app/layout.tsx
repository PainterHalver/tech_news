import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech News",
  description: "All the latest tech news in one convenient place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen min-w-fit no-scrollbar`}>
        <NavBar />
        <div className="flex flex-1">
          <SideBar />
          <div className="lg:pl-60 bg-bg-primary flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
