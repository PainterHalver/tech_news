"use client";

import { Metadata } from "next";
import Image from "next/image";

import axios from "@/lib/axios";
import { useAuthStore } from "@/lib/zustand/AuthStore";

import { useEffect, useState } from "react";

export default function Home() {
  const authenticated = useAuthStore((state) => state.authenticated);

  return (
    <main className="flex bg-[red] py-5 px-16 min-h-full">
      <div className={`flex flex-wrap justify-center bg-[cyan] flex-1 gap-8`}>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] h-[22rem] text-xs bg-[blue]">123</div>
      </div>
    </main>
  );
}
