import React from "react";
import { Post, Publisher } from "@/lib/types";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";

interface Props {
  post: Post;
}

interface HistoryPostCardProps {
  post: Post;
}

const HistoryPostCard: React.FC<HistoryPostCardProps> = ({ post }) => {
  return (
    <Link
      className="flex flex-col bg-bg-secondary hover:border-border-hover border border-border rounded-2xl overflow-hidden hover:cursor-pointer px-3 py-4 w-full md:w-[45rem]"
      href={`/posts/${post.id}`}
    >
      <div className="flex items-center">
        <Image
          src={`/images/${post.publisher.name}.jpg`}
          alt={`Icon image for publisher ${post.title}`}
          sizes="100vw"
          width={0}
          height={0}
          style={{ width: "40px", height: "auto", borderRadius: "50%" }}
          className="mr-2"
        />
        <div>
          <h2 className="text-text-primary">{post.title}</h2>
          <p className="text-sm">Viewed {moment(post.pivot?.updated_at).fromNow()}</p>
        </div>
      </div>
    </Link>
  );
};

export default HistoryPostCard;
