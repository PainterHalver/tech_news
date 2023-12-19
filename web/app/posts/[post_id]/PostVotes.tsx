"use client";

import DownvoteButton from "@/components/DownvoteButton";
import UpvoteButton from "@/components/UpvoteButton";
import { Post } from "@/lib/types";
import { showModal } from "@/lib/utils";
import { useState } from "react";
import axios from "@/lib/axios";
import { useSession } from "next-auth/react";

type Props = {
  post: Post;
};

export default function PostVotes({ post }: Props) {
  const [userVote, setUserVote] = useState(post.user_vote || 0);
  const [votesScore, setVotesScore] = useState(post.votes_score);
  const session = useSession();

  const handleUpvote = async (e: any) => {
    e.preventDefault();
    if (session.status !== "authenticated") return showModal("login_modal");

    const oldUserVote = userVote;
    try {
      setUserVote(oldUserVote === 1 ? 0 : 1);
      setVotesScore((prev) => prev + (oldUserVote === 1 ? -1 : 1));

      const response = await axios.post(`/api/posts/${post.id}/votes`, {
        value: oldUserVote === 1 ? 0 : 1,
      });
      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("HANDLE UPVOTE ERROR: ", error);
      setUserVote(oldUserVote);
      setVotesScore((prev) => prev - (oldUserVote === 1 ? -1 : 1));
    }
  };

  const handleDownvote = async (e: any) => {
    e.preventDefault();
    if (session.status !== "authenticated") return showModal("login_modal");

    const oldUserVote = userVote;
    try {
      setUserVote(oldUserVote === -1 ? 0 : -1);
      setVotesScore((prev) => prev + (oldUserVote === -1 ? 1 : -1));

      const response = await axios.post(`/api/posts/${post.id}/votes`, {
        value: oldUserVote === -1 ? 0 : -1,
      });
      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("HANDLE DOWNVOTE ERROR: ", error);
      setUserVote(oldUserVote);
      setVotesScore((prev) => prev - (oldUserVote === -1 ? 1 : -1));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <UpvoteButton userVote={userVote} onClick={handleUpvote} className="btn-md text-3xl" />
      <DownvoteButton userVote={userVote} onClick={handleDownvote} className="btn-md text-3xl" />
      <p className="font-bold w-5">{votesScore}</p>
    </div>
  );
}
