"use client";

import { Comment, Post } from "@/lib/types";
import { avatarLink, trimString } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

type Props = {
  post: Post;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export default function PostCommentBox({ post, setComments }: Props) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const session = useSession();
  const user = session?.data?.user;

  const postComment = async () => {
    try {
      setLoading(true);
      const res = await axios.post<Comment>(`/api/posts/${post.id}/comments`, {
        content: comment,
      });
      const commentData = res.data;
      setComments((prev) => [commentData, ...prev]);
      setComment("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.log("POST COMMENT ERROR: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col border border-border rounded-lg">
      <div className="flex gap-3 px-3 py-3 items-center">
        <div className="avatar">
          <div className="w-10 rounded-xl">
            <img src={avatarLink(user?.avatar)} />
          </div>
        </div>
        <p className="text-lg">Share your thoughts</p>
      </div>
      <textarea
        name="comment"
        id="comment"
        cols={30}
        rows={3}
        className="focus:outline-none px-3 py-2 bg-bg-primary border-y border-border"
        value={comment}
        placeholder="Write your comment here..."
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div className="flex gap-3 px-3 py-2 justify-end">
        <button className="btn btn-primary btn-sm" disabled={comment.length === 0 || loading} onClick={postComment}>
          {loading ? <span className="loading loading-spinner"></span> : "Submit"}
        </button>
      </div>
    </div>
  );
}
