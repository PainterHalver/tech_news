import Link from "next/link";
import { HomeIcon } from "./icons/HomeIcon";

export default function SideBar() {
  return (
    <aside className="border-r border-border fixed h-full overflow-scroll no-scrollbar bg-bg-primary lg:w-60 hidden lg:block lg:pt-4">
      <ul className="menu menu-md w-full p-0 [&_li>*]:rounded-none">
        <li className="menu-title">Discover</li>
        <li>
          <Link href={"/"}>
            <HomeIcon /> Newly Updated
          </Link>
        </li>
        <li>
          <Link href={"/"}>Most loved</Link>
        </li>
        <li>
          <Link href={"/"}>Most discussed</Link>
        </li>
        <li>
          <Link href={"/"}>Search</Link>
        </li>
      </ul>
      <ul className="menu menu-md w-full p-0 [&_li>*]:rounded-none">
        <li className="menu-title">Manage</li>
        <li>
          <Link href={"/"}>Bookmarks</Link>
        </li>
        <li>
          <Link href={"/"}>Bookmarks</Link>
        </li>
        <li>
          <Link href={"/"}>Follows</Link>
        </li>
      </ul>
    </aside>
  );
}
