import { Post } from "@/lib/types";
import { useCallback, useState } from "react";
import { BiUpvote } from "react-icons/bi";

type Props = {
  post: Post;
  className?: string;
};

export default function UpvoteButton({ post, className }: Props) {
  const [vote, setVote] = useState(post.user_vote);

  const handleUpvote = useCallback((e: any) => {
    e.preventDefault();
    console.log("vote11", vote);
  }, []);

  return (
    <button className={`btn btn-ghost btn-square btn-sm ${className}`} onClick={handleUpvote}>
      <BiUpvote className={`text-2xl ${post.user_vote === 1 && "text-upvoted"}`} />
    </button>
  );
}
