"use client";

import { Post } from "@/lib/types";
import { handleShare, showModal, trimString } from "@/lib/utils";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiCommentDetail, BiShareAlt, BiUpvote } from "react-icons/bi";
import UpvoteButton from "../UpvoteButton";

import axios from "@/lib/axios";
import { useSession } from "next-auth/react";

import "moment/locale/vi";
moment.locale("vi");

type Props = {
  post: Post;
  isLast: boolean;
  addPage: () => void;
};

export const PostCard = ({ post, isLast, addPage }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const [userVote, setUserVote] = useState(post.user_vote || 0);
  const [votesScore, setVotesScore] = useState(post.votes_score);

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry.isIntersecting) {
        addPage();
        observer.unobserve(entry.target);
      }
    });

    observer.observe(cardRef.current);
  }, [isLast]);

  const handleUpvoteToggle = async (e: any) => {
    e.preventDefault();
    if (session.status !== "authenticated") return showModal("login_modal");

    const oldUserVote = userVote;
    const oldVoteScore = votesScore;
    try {
      const newUserVote = oldUserVote === 1 ? 0 : 1;
      let newVoteScore = oldVoteScore;
      if (userVote === 0) newVoteScore += 1;
      else if (userVote === -1) newVoteScore += 2;
      else if (userVote === 1) newVoteScore -= 1;

      setUserVote(newUserVote);
      setVotesScore(newVoteScore);
      const response = await axios.post(`/api/posts/${post.id}/votes`, {
        value: newUserVote,
      });
      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log("HANDLE UPVOTE ERROR: ", error);
      setUserVote(oldUserVote);
      setVotesScore(oldVoteScore);
    }
  };

  return (
    <Link
      className="flex flex-col w-[20rem] h-[25rem] text-xs bg-bg-secondary hover:border-border-hover border border-border rounded-2xl overflow-hidden hover:cursor-pointer"
      // onClick={() => {
      //   const modal = document.getElementById("post_modal");
      //   (modal as any).showModal();
      // }}
      href={`/posts/${post.id}`}
    >
      <div className="w-full h-fit" ref={cardRef}>
        <Image
          src={post.image}
          alt={`Cover image for ${post.title}`}
          sizes="100vw"
          width={0}
          height={0}
          style={{ width: "100%", height: "150px" }}
          className="object-cover object-center"
        />
      </div>
      <div className="h-fit pl-2 py-2 flex items-center">
        <Image
          src={`/images/${post.publisher.name}.jpg`}
          alt={`Icon image for publisher ${post.title}`}
          sizes="100vw"
          width={0}
          height={0}
          style={{ width: "40px", height: "auto", borderRadius: "50%" }}
        />
        {/* <span className="pl-2 text-base text-text-primary">{post.publisher.full_name}</span> */}
      </div>
      <p className="px-3 pb-2">{moment(post.published_at).fromNow()}</p>
      <h2 className="px-3 text-lg font-bold text-text-primary">{trimString(post.title, 90)}</h2>
      <div className="px-3 mt-auto border-t border-border flex justify-between py-2">
        <div className="flex gap-1 items-center">
          <UpvoteButton userVote={userVote} onClick={handleUpvoteToggle} />
          <p className="text-base font-bold">{votesScore}</p>
        </div>
        <div className="flex gap-1 items-center">
          <div className="btn btn-ghost btn-square btn-sm">
            <BiCommentDetail className="text-[1.3rem]" />
          </div>
          <p className="text-base font-bold">{post.comments_count}</p>
        </div>
        <div
          className="btn btn-ghost btn-square btn-sm"
          onClick={(e) => {
            e.preventDefault();
            handleShare(post.id);
          }}
        >
          <BiShareAlt className="text-2xl" />
        </div>
      </div>
    </Link>
  );
};
