"use client";

import { FaLightbulb } from "react-icons/fa";

export default function FeedbackButton() {
  return (
    <div className="mr-5">
      <button
        className="btn btn-sm border btn-outline"
        onClick={() => {
          const modal = document.getElementById("feedback_modal");
          (modal as any).showModal();
        }}
      >
        <FaLightbulb className="text-[#e4e45d]" /> Góp ý ứng dụng
      </button>
    </div>
  );
}
