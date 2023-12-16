import { Post } from "@/lib/types";
import { BiUpvote } from "react-icons/bi";

type Props = {
  userVote?: number;
  className?: string;
  onClick?: (e: any) => void;
};

export default function UpvoteButton({ userVote, className, onClick }: Props) {
  return (
    <button className={`btn btn-ghost btn-square btn-sm ${className}`} onClick={onClick}>
      <BiUpvote className={`text-2xl ${userVote === 1 && "text-upvoted"}`} />
    </button>
  );
}
