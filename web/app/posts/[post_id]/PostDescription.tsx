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
      <p className="text-text-primary font-[300]">
        {shouldShowFullDescription ? post.description : trimString(post.description, PREVIEW_LENGTH)}
        &nbsp;&nbsp;
        <span className="link link-hover text-text-secondary" onClick={toggleDescription}>
          {shouldShowFullDescription ? "Show less" : "Show more"}
        </span>
      </p>
    </div>
  );
}
