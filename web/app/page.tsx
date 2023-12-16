"use client";

import { PostCard } from "@/components/PostCard/PostCard";
import { PostCardSkeleton } from "@/components/PostCard/PostCardSkeleton";
import { PostModal } from "@/components/PostModal";
import { Paginated, Post } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

// const getPostsFirstPage = async () => {
//   const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/posts", { cache: "no-store" });
//   const posts = await res.json();
//   return posts.posts as Paginated<Post>;
// };

const PER_PAGE = 10;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);

  const fetchPosts = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`/api/posts?per_page=${PER_PAGE}&page=${page}`);
      const posts = res.data as Paginated<Post>;
      setPosts((prev) => [...prev, ...posts.data]);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <main className="flex flex-col py-5 lg:px-16 px-8 min-h-full">
      <h1 className="text-xl font-bold">Newly Updated</h1>
      <div className="flex flex-wrap justify-center flex-1 gap-8 mt-8">
        {posts.map((post, index) => (
          <PostCard post={post} key={post.id} isLast={index === posts.length - 1} addPage={() => setPage(page + 1)} />
        ))}
        {/* add per_page skeleton*/}
        {fetching && Array.from({ length: PER_PAGE }).map((_, index) => <PostCardSkeleton key={index + 100000} />)}
      </div>
      <PostModal />
    </main>
  );
}
