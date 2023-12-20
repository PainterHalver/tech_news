"use client";

import { Comment, Paginated, Post } from "@/lib/types";
import { trimString } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import moment from "moment";

type Props = {
  post: Post;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export default function PostComments({ post, comments, setComments }: Props) {
  const [loading, setLoading] = useState(false);

  const fetchPostComments = async (post_id: number) => {
    try {
      setLoading(true);
      const res = await axios.get<Paginated<Comment>>(`/api/posts/${post_id}/comments`);
      const comments = res.data;
      return comments.data;
    } catch (error) {
      console.log("FETCH POST COMMENTS ERROR: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const commentsData = await fetchPostComments(post.id);
      setComments(commentsData || []);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col gap-1 items-start border border-border rounded-lg">
        <div className="flex gap-3 px-3 py-3 items-center">
          <div className="avatar">
            <div className="w-10 rounded-xl">
              <div className="skeleton w-full h-full rounded-xl"></div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="skeleton w-36 h-4"></div>
            <div className="skeleton w-20 h-4"></div>
          </div>
        </div>
        <div className="px-3 pb-3 w-full flex flex-col gap-3">
          <div className="skeleton w-full h-4"></div>
          <div className="skeleton w-full h-4"></div>
        </div>
      </div>
    );

  if (comments.length === 0)
    return (
      <div className="flex flex-col gap-5">
        <p className="text-text-primary">No comments yet</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      {comments.map((comment) => (
        <div className="flex flex-col gap-1 items-start border border-border rounded-lg" key={comment.id}>
          <div className="flex gap-3 px-3 py-3 items-center">
            <div className="avatar">
              <div className="w-10 rounded-xl">
                <img src={comment.user.avatar || "/images/default-avatar.jpg"} />
              </div>
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="text-sm text-text-primary font-bold">{comment.user.full_name}</p>
              <p className="text-xs text-text-secondary">
                @{comment.user.username}・{moment(comment.created_at).fromNow()}
              </p>
            </div>
          </div>
          <p className="px-3 pb-2 text-text-primary">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
