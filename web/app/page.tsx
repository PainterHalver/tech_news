import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Test title",
  description: "This is a test description",
};

export default async function Home() {
  const data = await fetch("https://jsonplaceholder.typicode.com/posts");

  return <main className="flex min-h-screen flex-col items-center justify-between p-24">Hallo</main>;
}
