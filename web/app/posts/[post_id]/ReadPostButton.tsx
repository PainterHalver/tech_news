"use client";

import axios from "@/lib/axios";
import { Post } from "@/lib/types";
import Link from "next/link";
import toast from "react-hot-toast";
import { TbShare3 } from "react-icons/tb";

type Props = {
  post: Post;
};

export default function ReadPostButton({ post }: Props) {
  const handleUpsertView = async (e: any) => {
    try {
      const response = await axios.post(`/api/posts/${post.id}/views`);
      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("HANDLE UPSERT VIEW ERROR: ", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Link
      target="_blank"
      href={post.link}
      className="btn btn-outline font-bold text-base text-text-primary"
      onClick={handleUpsertView}
    >
      <TbShare3 className="text-xl" /> Read post
    </Link>
  );
}
