import { getServerSession } from "next-auth";
import Link from "next/link";
import { AiOutlineFire } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { GoHistory } from "react-icons/go";
import { HiOutlineHome } from "react-icons/hi2";
import { IoCheckboxOutline, IoSearchOutline } from "react-icons/io5";
import { PiChatCircleDots } from "react-icons/pi";

export default async function SideBar() {
  const session = await getServerSession();

  return (
    <aside className="border-r border-border fixed h-full overflow-scroll no-scrollbar bg-bg-primary lg:w-60 hidden lg:block lg:pt-4">
      <ul className="menu menu-md w-full p-0 [&_li>*]:rounded-none">
        <li className="menu-title text-text-secondary">Discover</li>
        <li>
          <Link href={"/"}>
            <HiOutlineHome className="text-lg" /> Newly Updated
          </Link>
        </li>
        <li>
          <Link href={"/loved"}>
            <AiOutlineFire className="text-lg" /> Most loved
          </Link>
        </li>
        <li>
          <Link href={"/discussed"}>
            <PiChatCircleDots className="text-lg" /> Most discussed
          </Link>
        </li>
        <li>
          <Link href={"/search"}>
            <IoSearchOutline className="text-lg" /> Search
          </Link>
        </li>
      </ul>

      {session && (
        <ul className="menu menu-md w-full p-0 [&_li>*]:rounded-none">
          <li className="menu-title text-text-secondary">Manage</li>
          <li>
            <Link href={"/bookmarks"}>
              <BsBookmark className="text-lg" /> Bookmarks
            </Link>
          </li>
          <li>
            <Link href={"/history"}>
              <GoHistory className="text-lg" /> History
            </Link>
          </li>
          <li>
            <Link href={"/following"}>
              <IoCheckboxOutline className="text-lg" /> Following
            </Link>
          </li>
        </ul>
      )}
    </aside>
  );
}
