"use client";

import axios from "@/lib/axios";
import { Comment, Post, Stats } from "@/lib/types";
import { avatarLink, handleShare, showModal } from "@/lib/utils";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { BiCommentDetail, BiShareAlt } from "react-icons/bi";
import { EditProfileModal } from "./EditProfileModal";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const session = useSession();
  const user = session?.data?.user;
  const [stats, setStats] = useState<Stats | null>(null);

  const [uploading, setUploading] = useState(false);

  const handleAvatarUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0] as File;
      console.log("FILE: ", file);
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axios.post("/api/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const userData = res.data.data;
      await session.update(userData);
      toast.success("Avatar updated successfully.");
    } catch (error) {
      console.log("HANDLE AVATAR UPDATE ERROR: ", error);
      toast.error("Unable to update avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/me/statistics");
        const stats = res.data.data;
        setStats(stats);
      } catch (error) {
        console.log("FETCH STATS ERROR: ", error);
      }
    };

    fetchStats();
  }, []);

  if (!user) return "Loading....";

  return (
    <main className="flex min-h-full justify-center flex-col md:flex-row">
      <main className="border-[0.5px] border-border flex-1 flex flex-col max-w-3xl">
        <div className="flex justify-between p-5">
          <div className="w-32 h-32 rounded-full relative group">
            <Image
              src={avatarLink(user.avatar)}
              alt={`Avatar of ${user.full_name}`}
              sizes="100vw"
              width={0}
              height={0}
              style={{ width: "100%", height: "100%" }}
              className={`rounded-full group-hover:opacity-75 ${uploading && "opacity-50"}`}
            />
            <input
              type="file"
              className="opacity-0 absolute top-0 left-0 bottom-0 right-0 hover:cursor-pointer"
              onChange={handleAvatarUpdate}
              accept="image/*"
              disabled={uploading}
            />
            {uploading && (
              <span className="loading loading-spinner loading-lg absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"></span>
            )}
          </div>
          <button
            className="btn btn-outline"
            onClick={(e) => {
              e.preventDefault();
              showModal("edit_profile_modal");
            }}
          >
            Edit profile
          </button>
        </div>
        <div className="px-5 pb-3 border-b border-border">
          <p className="text-text-primary text-xl">{user.full_name}</p>
          <p className="text-text-secondary">@{user.username}</p>
          <p className="text-text-secondary text-sm mt-1">Joined {moment(user.created_at).format("MMM DD YYYY")}</p>
        </div>

        <div className="stats rounded-none">
          <div className="stat">
            <div className="stat-title">Views</div>
            <div className="stat-value">{stats?.views_count ?? "..."}</div>
            {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
          </div>

          <div className="stat">
            <div className="stat-title">Comments</div>
            <div className="stat-value">{stats?.comments_count ?? "..."}</div>
            {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
          </div>

          <div className="stat">
            <div className="stat-title">Votes</div>
            <div className="stat-value">{stats?.votes_count ?? "..."}</div>
            {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
          </div>
        </div>

        <div className="stats rounded-none border-t border-border">
          <div className="stat">
            <div className="stat-title">Followed Publishers</div>
            <div className="stat-value">{stats?.followed_publishers_count ?? "..."}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Bookmarks</div>
            <div className="stat-value">{stats?.bookmarks_count ?? "..."}</div>
          </div>
        </div>
      </main>

      <EditProfileModal />
    </main>
  );
}