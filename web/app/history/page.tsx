"use client";

import { PostCard } from "@/components/PostCard/PostCard";
import { PostCardSkeleton } from "@/components/PostCard/PostCardSkeleton";
import { PostModal } from "@/components/PostModal";
import { Paginated, Post } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import HistoryPostCard from "./HistoryPostCard";
import HistoryPostCardSkeleton from "./HistoryPostCardSkeleton";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchPosts = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`/api/posts/history`);
      const posts = res.data as Post[];
      setPosts(posts);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="flex flex-col py-5 lg:px-16 px-8 min-h-full">
      <h1 className="text-xl font-bold">History</h1>
      <div className="flex flex-col flex-1 gap-5 mt-8 items-center">
        {posts.map((post, index) => (
          <HistoryPostCard post={post} key={post.id} />
        ))}
        {/* add per_page skeleton*/}
        {fetching && Array.from({ length: 10 }).map((_, index) => <HistoryPostCardSkeleton key={index + 100000} />)}
      </div>
      <PostModal />
    </main>
  );
}
