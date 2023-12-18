"use client";

import { Post } from "@/lib/types";
import { trimString } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  post: Post;
};

export default function CommentBox({ post }: Props) {
  const [comment, setComment] = useState("");

  const session = useSession();
  const user = session?.data?.user;

  return (
    <div className="flex flex-col border border-border">
      <div className="flex gap-3 px-3 py-3 items-center">
        <div className="avatar">
          <div className="w-10 rounded-xl">
            <img src={user?.avatar || "/images/default-avatar.jpg"} />
          </div>
        </div>
        <p className="text-lg">Share your thoughts</p>
      </div>
      <textarea
        name="comment"
        id="comment"
        cols={30}
        rows={6}
        className="focus:outline-none px-3 py-2 bg-bg-primary border-y border-border"
        value={comment}
        placeholder="Write your comment here..."
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div className="flex gap-3 px-3 py-2 justify-end">
        <button className="btn btn-primary btn-sm" disabled={comment.length === 0}>
          Post Comment
        </button>
      </div>
    </div>
  );
}
