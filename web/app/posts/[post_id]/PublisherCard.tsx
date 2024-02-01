"use client";

import { Publisher } from "@/lib/types";
import { showModal, trimString } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineDotsVertical } from "react-icons/hi";
import axios from "@/lib/axios";

type Props = {
  publisher: Publisher;
};

export default function PublisherCard({ publisher }: Props) {
  const [followed, setFollowed] = useState(publisher.user_followed);
  const session = useSession();

  const handleToggleFollow = async () => {
    if (session.status !== "authenticated") return showModal("login_modal");

    const oldFollowed = followed;
    try {
      setFollowed(!followed);
      const response = await axios.post(`/api/publishers/${publisher.id}/follows`);
      if (response.status !== 200) {
        throw new Error("Request failed");
      }
      toast.success(`${followed ? "Đã hủy theo dõi" : "Đã theo dõi"} ${publisher.name}`);
    } catch (error) {
      console.log("HANDLE TOGGLE FOLLOW ERROR: ", error);
      setFollowed(oldFollowed);
      toast.error("Có lỗi khi theo dõi nguồn tin");
    }
  };

  return (
    <div className="border border-border rounded-2xl flex items-center">
      <div className="h-fit pl-2 py-2 flex items-center mr-2">
        <Image
          src={`/images/${publisher.name}.jpg`}
          alt={`Icon image for publisher ${publisher.name}`}
          sizes="100vw"
          width={0}
          height={0}
          style={{ width: "45px", height: "auto", borderRadius: "50%" }}
        />
      </div>
      <div className="flex flex-col justify-center gap-[2px]">
        <span className="text-sm text-text-primary font-bold">{trimString(publisher.full_name, 23)}</span>
        <span className="text-xs text-text-secondary">@{publisher.name}</span>
      </div>
      {session.status === "authenticated" && (
        <div className="dropdown dropdown-end ml-auto mr-2">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
            <HiOutlineDotsVertical className="text-xl" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <div onClick={handleToggleFollow}>{followed ? "Hủy theo dõi" : "Theo dõi"}</div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
