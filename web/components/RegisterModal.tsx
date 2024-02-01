"use client";
import axios from "@/lib/axios";
import { closeModal, showModal } from "@/lib/utils";
import Axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useState } from "react";

type RegisterErrors = {
  username?: string[];
  password?: string[];
  full_name?: string[];
  password_confirm?: string[];
};

export const RegisterModal = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({});

  const handleRegister = async () => {
    try {
      setLoading(true);
      setRegisterErrors({});
      const res = await axios.post("/api/auth/signup", {
        username,
        full_name: fullName,
        password,
        password_confirm: confirmPassword,
      });

      // Sign in the user if registration is successful
      const response = await signIn("credentials", { username, password, redirect: false });
      if (response && !response.error) {
        const modal = document.getElementById("register_modal");
        (modal as any).close();

        document.location.reload();
      }
    } catch (error: unknown | AxiosError) {
      if (Axios.isAxiosError(error)) {
        const errors = error.response?.data.errors;
        if (errors) {
          setRegisterErrors(errors);
        }
      }
      console.log("HANDLE REGISTER ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="register_modal" className="modal">
      <div className="modal-box flex flex-col no-scrollbar">
        <h3 className="font-bold text-xl text-center text-text-primary">Đăng ký</h3>
        <form className="form-control w-full" onSubmit={handleRegister}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Tên đăng nhập</span>
            </div>
            <input
              type="text"
              name="username"
              placeholder="tên đăng nhập"
              className={`input input-bordered w-full ${registerErrors.username ? "input-error" : ""}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {registerErrors.username && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{registerErrors.username[0]}</span>
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
              className={`input input-bordered w-full ${registerErrors.full_name ? "input-error" : ""}`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {registerErrors.full_name && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{registerErrors.full_name[0]}</span>
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
              className={`input input-bordered w-full ${registerErrors.password ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {registerErrors.password && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{registerErrors.password[0]}</span>
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
              placeholder="nhập lại mật khẩu"
              className={`input input-bordered w-full ${registerErrors.password_confirm ? "input-error" : ""}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {registerErrors.password_confirm && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{registerErrors.password_confirm[0]}</span>
              </div>
            )}
          </label>
          <p className="pt-2">
            Đã có tài khoản? &nbsp;
            <span
              className="link hover:opacity-100 opacity-90"
              onClick={() => {
                closeModal("register_modal");
                showModal("login_modal");
              }}
            >
              Đăng nhập
            </span>
          </p>
          <button type="submit" className="btn btn-outline mt-3" disabled={loading} onClick={handleRegister}>
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
