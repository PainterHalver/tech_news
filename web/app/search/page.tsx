"use client";

import { PostCard } from "@/components/PostCard/PostCard";
import { PostCardSkeleton } from "@/components/PostCard/PostCardSkeleton";
import { PostModal } from "@/components/PostModal";
import { Paginated, Post } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";

const PER_PAGE = 10;

export default function SearchPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [inputString, setInputString] = useState("");
  const [query, setQuery] = useState("");

  const fetchPosts = async (search?: string) => {
    try {
      setFetching(true);
      const res = await axios.get(`/api/posts?per_page=${PER_PAGE}&page=${page}&search=${search ?? query}`);
      const posts = res.data as Paginated<Post>;
      setPosts((prev) => [...prev, ...posts.data]);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPosts([]);
    setQuery(inputString);
    if (page === 1) return fetchPosts(inputString);
    setPage(1);
  };

  useEffect(() => {
    if (page === 0) return;

    fetchPosts();
  }, [page]);

  useEffect(() => {
    document.title = "Tìm kiếm | Tech News";
  }, []);

  return (
    <main className="flex flex-col py-5 lg:px-16 px-8 min-h-full gap-3">
      <h1 className="text-xl font-bold">Tìm kiếm</h1>
      <form className="w-full flex gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm"
          className="input input-bordered input-md w-full max-w-md"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
          Tìm kiếm
        </button>
      </form>
      <div className="flex flex-wrap justify-center flex-1 gap-8 mt-8">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <PostCard post={post} key={post.id} isLast={index === posts.length - 1} addPage={() => setPage(page + 1)} />
          ))
        ) : (
          <div className="text-xl">Không tìm thấy tin tức</div>
        )}
        {/* add per_page skeleton*/}
        {fetching && Array.from({ length: PER_PAGE }).map((_, index) => <PostCardSkeleton key={index + 100000} />)}
      </div>
      <PostModal />
    </main>
  );
}
