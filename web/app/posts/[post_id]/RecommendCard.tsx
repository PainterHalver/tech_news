"use client";

import { Post, Publisher } from "@/lib/types";
import { showModal, trimString } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineDotsVertical } from "react-icons/hi";
import axios from "@/lib/axios";
import Link from "next/link";

type Props = {
  post: Post;
};

export default function RecommendCard({ post }: Props) {
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendedPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/posts/${post.id}/recommend`);
      const posts = res.data as Post[];
      setRecommendedPosts(posts);
    } catch (error) {
      console.log("FETCH RECOMMENDED POSTS ERROR: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedPosts();
  }, []);

  if (loading)
    return (
      <div className="border border-border rounded-2xl flex items-center overflow-hidden">
        <div className="">
          <p className="text-text-primary font-bold py-2 pl-3">Mọi người cũng đọc</p>
          <div className="flex items-center p-2 gap-2">
            <div className="skeleton w-10 h-10 rounded-full"></div>
            <div className="flex flex-col">
              <div className="skeleton w-28 h-4 mb-1"></div>
              <div className="skeleton w-20 h-3"></div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="border border-border rounded-2xl flex items-center overflow-hidden">
      <div className="">
        <p className="text-text-primary font-bold py-2 pl-3">Mọi người cũng đọc</p>
        {recommendedPosts.length > 0 ? (
          recommendedPosts.map((post, index) => (
            <Link href={`/posts/${post.post_id}`} key={post.id}>
              <div key={post.id} className="flex items-center p-2 gap-2 hover:bg-base-100 hover:cursor-pointer">
                <Image
                  src={`/images/${post.publisher.name}.jpg`}
                  alt={`Icon image for publisher ${post.publisher.full_name}`}
                  width={43}
                  height={43}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-text-primary">{trimString(post.title, 40)}</span>
                  <span className="text-xs text-text-secondary">{post.publisher.full_name}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm pl-3 pb-3">Không tìm thấy gợi ý</p>
        )}
      </div>
    </div>
  );
}
