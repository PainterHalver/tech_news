"use client";

import { Metadata } from "next";
import Image from "next/image";

import axios from "@/lib/axios";
import { useAuthStore } from "@/lib/zustand/AuthStore";

import { useEffect, useState } from "react";

export default function Home() {
  const [gridCols, setGridCols] = useState(1);
  const authenticated = useAuthStore((state) => state.authenticated);

  useEffect(() => {
    const calculateGridCols = () => {
      const screenWidth = window.innerWidth;
      let cols = 1;

      if (screenWidth >= 640) {
        cols = 2;
      }
      if (screenWidth >= 1360) {
        cols = 3;
      }
      if (screenWidth >= 1670) {
        cols = 4;
      }

      setGridCols(cols);
    };

    calculateGridCols();
    window.addEventListener("resize", calculateGridCols);

    return () => {
      window.removeEventListener("resize", calculateGridCols);
    };
  }, []);

  return (
    <main className="flex bg-[red] py-5 px-16 min-h-full">
      <div className={`grid grid-cols-${gridCols} bg-[cyan] flex-1 gap-8`}>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
        <div className="w-[20rem] text-xs bg-[blue]">123</div>
      </div>
    </main>
  );
}
