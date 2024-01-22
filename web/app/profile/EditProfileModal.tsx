"use client";
import axios from "@/lib/axios";
import Axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

type EditErrors = {
  password?: string[];
  full_name?: string[];
  new_password?: string[];
  password_confirm?: string[];
};

export const EditProfileModal = () => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [editErrors, setEditErrors] = useState<EditErrors>({});

  const session = useSession();

  const handleEdit = async () => {
    try {
      setLoading(true);
      setEditErrors({});
      const res = await axios.patch("/api/me", {
        full_name: fullName,
        password: password === "" ? null : password,
        new_password: newPassword === "" ? null : newPassword,
        password_confirm: confirmPassword === "" ? null : confirmPassword,
      });

      // update the user session
      await session.update(res.data.data);

      const modal = document.getElementById("edit_profile_modal");
      (modal as any).close();
      toast.success("Cập nhật thông tin thành công.");
    } catch (error: unknown | AxiosError) {
      if (Axios.isAxiosError(error)) {
        const errors = error.response?.data.errors;
        if (errors) {
          setEditErrors(errors);
        }
      }
      console.log("HANDLE EDIT PROFILE ERROR:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="edit_profile_modal" className="modal">
      <div className="modal-box flex flex-col no-scrollbar">
        <h3 className="font-bold text-xl text-center text-text-primary">Chỉnh sửa hồ sơ</h3>
        <form className="form-control w-full" onSubmit={handleEdit}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Tên đầy đủ</span>
            </div>
            <input
              type="text"
              name="full_name"
              className={`input input-bordered w-full ${editErrors.full_name ? "input-error" : ""}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {editErrors.full_name && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.full_name[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Mật khẩu</span>
            </div>
            <input
              type="password"
              name="password"
              className={`input input-bordered w-full ${editErrors.password ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {editErrors.password && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.password[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Mật khẩu mới</span>
            </div>
            <input
              type="password"
              name="new_password"
              className={`input input-bordered w-full ${editErrors.new_password ? "input-error" : ""}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {editErrors.new_password && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.new_password[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Nhập lại mật khẩu</span>
            </div>
            <input
              type="password"
              name="password_confirm"
              className={`input input-bordered w-full ${editErrors.password_confirm ? "input-error" : ""}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {editErrors.password_confirm && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.password_confirm[0]}</span>
              </div>
            )}
          </label>
          <button type="submit" className="btn btn-outline mt-5" disabled={loading} onClick={handleEdit}>
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
