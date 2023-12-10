import Link from "next/link";

export default function NavBar() {
  return (
    <div className="w-full flex bg-bg-primary border-b border-border sticky top-0 py-1 items-center">
      <div className="flex-1">
        <Link href="/" className="btn bg-bg-primary hover:bg-bg-primary border-none">
          <p className="text-lg">Tech News</p>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mr-4">
            <div className="w-8 rounded-full">
              <img alt="Profile Picture" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <ul tabIndex={0} className="mt-4 z-[1] p-1 shadow menu menu-md dropdown-content bg-base-100 rounded-box w-60">
            <li>
              <a className="text-base">Profile</a>
            </li>
            <li>
              <a className="text-base">Settings</a>
            </li>
            <li>
              <a className="text-base">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
