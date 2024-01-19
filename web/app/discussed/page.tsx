"use client";

import { PostCard } from "@/components/PostCard/PostCard";
import { PostCardSkeleton } from "@/components/PostCard/PostCardSkeleton";
import { PostModal } from "@/components/PostModal";
import { Paginated, Post } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

const PER_PAGE = 10;

export default function MostDiscussed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [sortTime, setSortTime] = useState<"week" | "month" | "year">("week");

  const fetchPosts = async () => {
    try {
      setFetching(true);
      const res = await axios.get(
        `/api/posts?per_page=${PER_PAGE}&page=${page}&sort_by=comments_count&sort_time=${sortTime}`
      );
      const posts = res.data as Paginated<Post>;
      setPosts((prev) => [...prev, ...posts.data]);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    if (page === 1) fetchPosts();
    else setPage(1);
  }, [sortTime]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <main className="flex flex-col py-5 lg:px-16 px-8 min-h-full">
      <h1 className="text-xl font-bold mb-3">Tin tức được bàn luận nhiều nhất</h1>
      <div role="tablist" className="tabs tabs-boxed w-fit">
        <a role="tab" className={`tab ${sortTime === "week" ? "tab-active" : ""}`} onClick={() => setSortTime("week")}>
          Theo tuần
        </a>
        <a
          role="tab"
          className={`tab ${sortTime === "month" ? "tab-active" : ""}`}
          onClick={() => setSortTime("month")}
        >
          Theo tháng
        </a>
        <a role="tab" className={`tab ${sortTime === "year" ? "tab-active" : ""}`} onClick={() => setSortTime("year")}>
          Theo năm
        </a>
      </div>
      <div className="flex flex-wrap justify-center flex-1 gap-8 mt-8">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard post={post} key={post.id} isLast={index === posts.length - 1} addPage={() => setPage(page + 1)} />
          ))
        ) : (
          <div className="text-xl">Không tìm thấy tin tức nào</div>
        )}
        {/* add per_page skeleton*/}
        {fetching && Array.from({ length: PER_PAGE }).map((_, index) => <PostCardSkeleton key={index + 100000} />)}
      </div>
      <PostModal />
    </main>
  );
}
