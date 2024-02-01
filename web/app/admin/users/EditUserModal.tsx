"use client";
import axios from "@/lib/axios";
import { User } from "@/lib/types";
import { closeModal, showModal } from "@/lib/utils";
import Axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type EditUserErrors = {
  username?: string[];
  password?: string[];
  full_name?: string[];
  role?: string[];
};

type Props = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  selectedUser: User | null;
};

export const EditUserModal = ({ selectedUser, users, setUsers }: Props) => {
  const [loading, setLoading] = useState(false);
  const [editErrors, setEditErrors] = useState<EditUserErrors>({});

  const handleEditUser = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      setEditErrors({});
      const { username, full_name, password, role } = e.target.elements;
      const res = await axios.patch(`/api/users/${selectedUser?.id}`, {
        username: username.value,
        full_name: full_name.value,
        password: password.value,
        role: role.value,
      });

      const userData = res.data;

      const index = users.findIndex((user) => user.id === userData.id);
      const newUsers = [...users];
      newUsers[index] = userData;
      setUsers(newUsers);
      closeModal("edit_user_modal");
      toast.success("Cập nhật người dùng thành công.");
    } catch (error: unknown | AxiosError) {
      if (Axios.isAxiosError(error)) {
        const errors = error.response?.data.errors;
        if (errors) {
          setEditErrors(errors);
        }
      }
      console.log("HANDLE REGISTER ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="edit_user_modal" className="modal">
      <div className="modal-box flex flex-col no-scrollbar">
        <h3 className="font-bold text-xl text-center text-text-primary">Chỉnh sửa người dùng</h3>
        <form className="form-control w-full" onSubmit={handleEditUser} autoComplete="off">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Tên đăng nhập</span>
            </div>
            <input
              type="text"
              name="username"
              placeholder="tên đăng nhập"
              className={`input input-bordered w-full ${editErrors.username ? "input-error" : ""}`}
              defaultValue={selectedUser?.username}
              autoComplete="new-off"
            />
            {editErrors.username && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.username[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Tên đầy đủ</span>
            </div>
            <input
              type="text"
              name="full_name"
              placeholder="tên đầy đủ"
              className={`input input-bordered w-full ${editErrors.full_name ? "input-error" : ""}`}
              defaultValue={selectedUser?.full_name}
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
              placeholder="mật khẩu"
              className={`input input-bordered w-full ${editErrors.password ? "input-error" : ""}`}
            />
            {editErrors.password && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.password[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Phân quyền</span>
            </div>

            <select
              name="role"
              className={`select select-bordered w-full ${editErrors.password ? "select-error" : ""}`}
            >
              <option value="user" selected={selectedUser?.role === "user"}>
                Người dùng
              </option>
              <option value="admin" selected={selectedUser?.role === "admin"}>
                Quản trị
              </option>
            </select>
            {editErrors.role && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.role[0]}</span>
              </div>
            )}
          </label>

          <button type="submit" className="btn btn-outline mt-5" disabled={loading}>
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
