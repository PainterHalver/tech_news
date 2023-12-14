"use client";

import { useAuthStore } from "@/lib/zustand/AuthStore";
import Link from "next/link";
import { useEffect } from "react";

import axios from "@/lib/axios";
import Axios from "axios";

const NavBar = () => {
  const authenticated = useAuthStore((state) => state.authenticated);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (res.status === 200) {
          login(res.data.data.user);
        }
      } catch (error) {
        if (Axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            return useAuthStore.setState({ authenticated: false, user: null });
          }
        }
        console.log("AUTH/ME ERROR:", error);
      }
    })();
  }, []);

  return (
    <div className="w-full flex bg-bg-primary border-b border-border sticky top-0 py-1 items-center">
      <div className="flex-1">
        <Link href="/" className="btn bg-bg-primary hover:bg-bg-primary border-none">
          <p className="text-lg">Tech News</p>
        </Link>
      </div>
      {authenticated ? (
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
                <a className="text-base">Logout</a>
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
