import { getServerSession } from "next-auth";
import Link from "next/link";
import { AiOutlineFire } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { GoHistory } from "react-icons/go";
import { HiOutlineHome, HiOutlineUsers, HiOutlineNewspaper } from "react-icons/hi2";
import { IoCheckboxOutline, IoSearchOutline } from "react-icons/io5";
import { PiChatCircleDots } from "react-icons/pi";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SideBar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <aside className="border-r border-border fixed h-full overflow-scroll no-scrollbar bg-bg-primary lg:w-60 hidden lg:block lg:pt-4">
      <ul className="menu menu-md w-full p-0 [&_li>*]:rounded-none">
        <li className="menu-title text-text-secondary">Khám phá</li>
        <li>
          <Link href={"/"}>
            <HiOutlineHome className="text-lg" /> Mới cập nhật
          </Link>
        </li>
        <li>
          <Link href={"/loved"}>
            <AiOutlineFire className="text-lg" /> Được yêu thích
          </Link>
        </li>
        <li>
          <Link href={"/discussed"}>
            <PiChatCircleDots className="text-lg" /> Nhiều bình luận
          </Link>
        </li>
        <li>
          <Link href={"/search"}>
            <IoSearchOutline className="text-lg" /> Tìm kiếm
          </Link>
        </li>
      </ul>

      {user?.role === "user" && (
        <ul className="menu menu-md w-full p-0 [&_li>*]:rounded-none">
          <li className="menu-title text-text-secondary">Quản lý</li>
          <li>
            <Link href={"/bookmarks"}>
              <BsBookmark className="text-lg" /> Bookmarks
            </Link>
          </li>
          <li>
            <Link href={"/history"}>
              <GoHistory className="text-lg" /> Lịch sử
            </Link>
          </li>
          <li>
            <Link href={"/following"}>
              <IoCheckboxOutline className="text-lg" /> Theo dõi
            </Link>
          </li>
        </ul>
      )}

      {user?.role === "admin" && (
        <ul className="menu menu-md w-full p-0 [&_li>*]:rounded-none">
          <li className="menu-title text-text-secondary">Quản trị</li>
          <li>
            <Link href={"/admin/users"}>
              <HiOutlineUsers className="text-lg" /> Quản lý người dùng
            </Link>
          </li>
          <li>
            <Link href={"/admin/posts"}>
              <HiOutlineNewspaper className="text-lg" /> Quản lý tin tức
            </Link>
          </li>
        </ul>
      )}
    </aside>
  );
}
