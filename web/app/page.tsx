"use client";

import { Metadata } from "next";
import Image from "next/image";

import axios from "@/lib/axios";
import { useAuthStore } from "@/lib/zustand/AuthStore";

// export const metadata: Metadata = {
//   title: "Test title",
//   description: "This is a test description",
// };

export default function Home() {
  const authenticated = useAuthStore((state) => state.authenticated);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {authenticated ? "YAY" : "NAY"}
    </main>
  );
}
