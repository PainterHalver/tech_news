"use client";
import axios from "@/lib/axios";
import { Post } from "@/lib/types";
import { closeModal } from "@/lib/utils";
import Axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  selectedPost: Post | null;
  fetchPosts: () => void;
};

export const ConfirmDeleteModal = ({ selectedPost, fetchPosts }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDeletePost = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.delete(`/api/posts/${selectedPost?.id}`);

      if (res.status === 204) {
        closeModal("delete_post_modal");
        toast.success("Xóa tin tức thành công.");
        fetchPosts();
      }
    } catch (error: unknown | AxiosError) {
      console.log("HANDLE REGISTER ERROR:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="delete_post_modal" className="modal">
      <div className="modal-box flex flex-col no-scrollbar items-center gap-3">
        <h3 className="font-bold text-xl text-center text-text-primary">Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muôn xóa tin tức này khỏi hệ thống?</p>
        <div className="flex justify-center gap-3 mt-3 w-full">
          <div className="btn w-3/6 btn-outline" onClick={() => closeModal("delete_post_modal")}>
            Hủy bỏ
          </div>
          <button className="btn btn-error w-3/6" onClick={handleDeletePost} disabled={loading}>
            {loading && <span className="loading loading-spinner"> </span>}Xóa tin
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop focus:border-none bg-backdrop">
        <button className="cursor-default">đóng</button>
      </form>
    </dialog>
  );
};
