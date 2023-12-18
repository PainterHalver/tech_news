import { Post } from "@/lib/types";
import { BiUpvote } from "react-icons/bi";

type Props = {
  userVote?: number;
  className?: string;
  onClick?: (e: any) => void;
};

export default function UpvoteButton({ userVote, className, onClick }: Props) {
  return (
    <button className={`text-2xl btn btn-ghost btn-square btn-sm ${className}`} onClick={onClick}>
      <BiUpvote className={`${userVote === 1 && "text-upvoted"}`} />
    </button>
  );
}
