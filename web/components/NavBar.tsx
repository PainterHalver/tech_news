"use client";

import Link from "next/link";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const NavBar = () => {
  const session = useSession();
  const user = session?.data?.user;

  const handleLogout = async () => {
    try {
      const response = await signOut({ redirect: true });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!session) return;

    if (session.status === "authenticated" && session.data?.token) {
      localStorage.setItem("token", session.data.token);
    } else if (session.status === "unauthenticated") {
      localStorage.removeItem("token");
    }
  }, [session]);

  return (
    <div className="w-full flex bg-bg-primary border-b border-border sticky top-0 py-1 items-center">
      <div className="flex-1">
        <Link href="/" className="btn bg-bg-primary hover:bg-bg-primary border-none">
          <p className="text-lg">Tech News</p>
        </Link>
      </div>
      {session.status === "authenticated" ? (
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mr-4">
              <div className="w-8 rounded-full">
                <img alt={`Profile Picture of ${user?.full_name}`} src={user!.avatar} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-4 z-[1] p-1 shadow menu menu-md dropdown-content bg-base-100 rounded-box w-60"
            >
              <li>
                <a className="text-base">Profile</a>
              </li>
              <li>
                <a className="text-base">Settings</a>
              </li>
              <li>
                <a className="text-base" onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="mr-5">
          <button
            className="btn btn-sm border btn-outline"
            onClick={() => {
              const modal = document.getElementById("login_modal");
              (modal as any).showModal();
            }}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
