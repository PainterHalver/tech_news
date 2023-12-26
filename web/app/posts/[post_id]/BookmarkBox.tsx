import { Post } from "@/lib/types";
import { useState } from "react";
import { BsBookmark, BsBookmarkCheckFill } from "react-icons/bs";
import axios from "@/lib/axios";

type Props = {
  post: Post;
};

export default function BookmarkBox({ post }: Props) {
  const [bookmarked, setBookmarked] = useState(post.user_bookmarked);

  const toogleBookmark = async () => {
    const oldBookmarked = bookmarked;
    try {
      setBookmarked(!bookmarked);
      const response = await axios.post(`/api/posts/${post.id}/bookmarks`);
      if (response.status !== 200) {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.log("HANDLE TOGGLE BOOKMARK ERROR: ", error);
      setBookmarked(oldBookmarked);
    }
  };

  return (
    <div
      className="flex btn btn-outline gap-2 py-2 px-3 justify-center items-center text-text-primary"
      onClick={toogleBookmark}
    >
      {bookmarked ? <BsBookmarkCheckFill className="text-xl" /> : <BsBookmark className="text-xl" />}
      <span className="text-base font-bold">{bookmarked ? "Bookmarked" : "Bookmark"}</span>
    </div>
  );
}
