import { Post } from "@/lib/types";
import { BiDownvote } from "react-icons/bi";

type Props = {
  userVote?: number;
  className?: string;
  onClick?: (e: any) => void;
};

export default function DownvoteButton({ userVote, className, onClick }: Props) {
  return (
    <button className={`text-2xl btn btn-ghost btn-square btn-sm ${className}`} onClick={onClick} aria-label="downvote">
      <BiDownvote className={`${userVote === -1 && "text-downvoted"}`} />
    </button>
  );
}
