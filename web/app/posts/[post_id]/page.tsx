"use client";

import axios from "@/lib/axios";
import { Comment, Post } from "@/lib/types";
import { handleShare, showModal, trimString } from "@/lib/utils";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCommentDetail, BiShareAlt } from "react-icons/bi";
import { TbShare3 } from "react-icons/tb";
import BookmarkBox from "./BookmarkBox";
import PostCommentBox from "./PostCommentBox";
import PostComments from "./PostComments";
import PostDescription from "./PostDescription";
import PostSkeleton from "./PostSkeleton";
import PostVotes from "./PostVotes";

type Props = {
  params: { post_id: string };
};

export default function PostPage({ params }: Props) {
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const session = useSession();

  const getPost = async (post_id: string) => {
    try {
      const res = await axios.get<Post>(`/api/posts/${post_id}`);
      const post = res.data;
      return post;
    } catch (error) {
      console.log("GET POST ERROR: ", error);
      redirect("/404");
    }
  };

  const toggleCommentBox = () => {
    if (!session || session.status !== "authenticated") {
      showModal("login_modal");
      return;
    }
    setShowCommentBox((prev) => !prev);
  };

  useEffect(() => {
    (async () => {
      const postData = await getPost(params.post_id);
      setPost(postData);
    })();
  }, []);

  if (!post) return <PostSkeleton />;

  return (
    <main className="flex min-h-full justify-center flex-col md:flex-row">
      <main className="border-[0.5px] border-border flex-1 flex flex-col max-w-3xl">
        <div className="w-full h-fit">
          <Image
            src={post.image}
            alt={`Cover image for ${post.title}`}
            sizes="100vw"
            width={0}
            height={0}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="flex flex-col px-5 py-7">
          <h1 className="text-3xl font-bold text-text-primary">{post.title}</h1>
          <p className="text-sm py-2">{moment(post.published_at).fromNow()}</p>
          <PostDescription post={post} />
        </div>
        <div className="flex justify-between border-y border-border py-2 px-5">
          <PostVotes post={post} />
          <div
            className="flex items-center gap-2 group hover:cursor-pointer hover:text-[chocolate] btn btn-ghost btn-md"
            onClick={toggleCommentBox}
          >
            <BiCommentDetail className="text-3xl" />
            <p className="font-bold text-lg">Comment</p>
          </div>
          <button
            className="flex items-center gap-2 group hover:cursor-pointer hover:text-[cyan] btn btn-ghost btn-md"
            onClick={() => handleShare(post.id)}
          >
            <BiShareAlt className="text-3xl" />
            <p className="font-bold text-lg">Share</p>
          </button>
        </div>

        <div className="mx-10 my-6 flex flex-col gap-5">
          {showCommentBox && <PostCommentBox post={post} setComments={setComments} />}
          <PostComments post={post} comments={comments} setComments={setComments} />
        </div>
      </main>

      <aside className="border-[0.5px] border-border w-full md:w-72 flex flex-col px-3 py-5 gap-5">
        <Link target="_blank" href={post.link} className="btn btn-outline font-bold text-base text-text-primary">
          <TbShare3 className="text-xl" /> Read post
        </Link>

        <BookmarkBox post={post} />

        <div className="border border-border rounded-2xl flex">
          <div className="h-fit pl-2 py-2 flex items-center mr-2">
            <Image
              src={`/images/${post.publisher.name}.jpg`}
              alt={`Icon image for publisher ${post.title}`}
              sizes="100vw"
              width={0}
              height={0}
              style={{ width: "45px", height: "auto", borderRadius: "50%" }}
            />
          </div>
          <div className="flex flex-col justify-center gap-[2px]">
            <span className="text-sm text-text-primary font-bold">{trimString(post.publisher.full_name, 23)}</span>
            <span className="text-xs text-text-secondary">@{post.publisher.name}</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
