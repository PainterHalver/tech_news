"use client";

import axios from "@/lib/axios";
import { Paginated, Post, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { showModal } from "@/lib/utils";
import moment from "moment";
import "moment/locale/vi";
import { BiCommentDetail, BiUpvote } from "react-icons/bi";
import Link from "next/link";
import { EditPostModal } from "./EditPostModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
moment.locale("vi");

const PER_PAGE = 10;

export default function ManageUsersPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [inputString, setInputString] = useState("");
  const [query, setQuery] = useState("");
  const tablePosts = posts.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  const totalPages = Math.ceil(posts.length / PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async (search?: string) => {
    try {
      setFetching(true);
      const res = await axios.get(`/api/posts?per_page=100000&page=1&search=${search ?? query}`);
      const posts = res.data as Paginated<Post>;
      setPosts(posts.data);
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
    fetchPosts(inputString);
    setPage(1);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="flex flex-col py-5 lg:px-16 px-8 min-h-full gap-4">
      <h1 className="text-xl font-bold">Quản lý tin tức</h1>
      <form className="w-full flex gap-4 mb-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm"
          className="input input-bordered input-md w-full max-w-md"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={fetching}>
          {fetching && <span className="loading loading-spinner"></span>} Tìm kiếm
        </button>
      </form>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-md uppercase bg-bg-table-header">
            <tr>
              <th scope="col" className="px-6 py-3 w-1/12">
                ID
              </th>
              <th scope="col" className="px-6 py-3 w-3/12">
                Tiêu đề
              </th>
              <th scope="col" className="px-6 py-3 w-2/12">
                Nguồn đăng tin
              </th>
              <th scope="col" className="px-6 py-3 w-2/12">
                Thời điểm đăng
              </th>
              <th scope="col" className="px-6 py-3 w-2/12">
                Tương tác
              </th>
              <th scope="col" className="px-6 py-3 w-2/12">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {tablePosts.map((post) => (
              <tr key={post.id} className="bg-bg-secondary border-b border-border hover:bg-[#1c1f2699]">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap w-1/12">
                  {post.id}
                </th>
                <td className="px-6 py-3 w-3/12">{post.title}</td>
                <td className="px-6 py-3 w-2/12">{post.publisher.full_name}</td>
                <td className="px-6 py-3 w-1/12">{moment(post.published_at).fromNow()}</td>
                <td className="px-6 py-3 w-2/12">
                  <div className="w-full flex items-center gap-1.5 text-base">
                    <BiUpvote className="text-upvoted" />
                    <span>{post.votes_score}</span>
                    <BiCommentDetail className="text-[chocolate]" />
                    <span>{post.comments_count}</span>
                  </div>
                </td>
                <td className="px-6 py-3 flex gap-3 w-2/12">
                  <Link href={`/posts/${post.id}`} className="btn btn-success btn-sm" target="_blank">
                    Xem
                  </Link>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSelectedPost(post);
                      showModal("edit_post_modal");
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => {
                      setSelectedPost(post);
                      showModal("delete_post_modal");
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="join mt-3 flex justify-end flex-wrap">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`join-item btn transition-none ${pageNumber === page ? "btn-disabled" : ""}`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>

      <EditPostModal selectedPost={selectedPost} setPosts={setPosts} posts={posts} />
      <ConfirmDeleteModal selectedPost={selectedPost} fetchPosts={fetchPosts} />
    </main>
  );
}
