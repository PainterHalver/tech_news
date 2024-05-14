"use client";

import axios from "@/lib/axios";
import { closeModal, showModal } from "@/lib/utils";
import Axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaLightbulb } from "react-icons/fa";

export const FeedbackModal = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);

  const handleFeedback = async () => {
    try {
      setLoading(true);
      setFeedbackError(false);
      const res = await axios.post("/api/feedbacks", {
        content,
      });
      toast.success("Gửi góp ý thành công. Cảm ơn bạn đã đóng góp ý kiến.");
      setContent("");
      closeModal("feedback_modal");
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="feedback_modal" className="modal">
      <div className="modal-box flex flex-col no-scrollbar">
        <h3 className="font-bold text-xl text-center text-text-primary">Góp ý ứng dụng</h3>
        <form className="form-control w-full" onSubmit={handleFeedback}>
          <label className="form-control w-full mt-4">
            <textarea
              name="content"
              placeholder="Nội dung góp ý"
              onChange={(e) => setContent(e.target.value)}
              className={`input input-bordered w-full h-36 py-2`}
            />
          </label>
          <button type="submit" className="btn btn-outline mt-5" disabled={loading} onClick={handleFeedback}>
            {loading ? <span className="loading loading-spinner"></span> : "Xác nhận"}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop focus:border-none bg-backdrop">
        <button className="cursor-default">đóng</button>
      </form>
    </dialog>
  );
};
