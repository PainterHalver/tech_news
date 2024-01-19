"use client";

import { Post } from "@/lib/types";
import { trimString } from "@/lib/utils";
import { useState } from "react";

type Props = {
  post: Post;
};

const PREVIEW_LENGTH = 380;

export default function PostDescription({ post }: Props) {
  const [shouldShowFullDescription, setShouldShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShouldShowFullDescription(!shouldShowFullDescription);
  };

  return (
    <div>
      <p className="text-text-primary font-[300] whitespace-pre-line">
        {shouldShowFullDescription ? post.description : trimString(post.description, PREVIEW_LENGTH)}
        &nbsp;&nbsp;
        {post.description.length > PREVIEW_LENGTH && (
          <span className="link link-hover text-text-secondary" onClick={toggleDescription}>
            {shouldShowFullDescription ? "Xem thêm" : "Rút gọn"}
          </span>
        )}
      </p>
    </div>
  );
}
