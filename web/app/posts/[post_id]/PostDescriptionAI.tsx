"use client";

import { Post } from "@/lib/types";
import { HTMLAttributes } from "react";
import Markdown from "react-markdown";

type Props = {
  post: Post;
} & HTMLAttributes<HTMLDivElement>;

export default function PostDescriptionAI({ post, ...props }: Props) {
  if (!post.description_generated) return null;

  return (
    <div className="border-l-[3px] border-primary p-2 gap-3 flex flex-col bg-bg-secondary mb-3" {...props}>
      <p className="text-text-primary">Tóm tắt AI (Gemini)</p>
      <Markdown className="text-text-primary font-[300] whitespace-pre-line text-[0.92rem]">
        {post.description_generated}
      </Markdown>
    </div>
  );
}
