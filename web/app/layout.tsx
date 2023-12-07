import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Tech News",
  description: "All the latest tech news in one convenient place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} flex flex-col min-h-screen`}>
        <NavBar />
        <div className="flex flex-1">
          <SideBar />
          <div className="pl-60 bg-bg-primary flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
