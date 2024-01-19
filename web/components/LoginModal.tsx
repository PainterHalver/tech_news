"use client";
import { closeModal, showModal } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

export const LoginModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setLoginError(false);
      const response = await signIn("credentials", { username, password, redirect: false });
      if (response && !response.error) {
        const modal = document.getElementById("login_modal");
        (modal as any).close();

        document.location.reload();
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box flex flex-col no-scrollbar">
        <h3 className="font-bold text-xl text-center text-text-primary">Đăng nhập</h3>
        <form className="form-control w-full" onSubmit={handleLogin}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Tên đăng nhập</span>
            </div>
            <input
              type="text"
              placeholder="tên đăng nhập"
              className={`input input-bordered w-full ${loginError ? "input-error" : ""}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Mật khẩu</span>
            </div>
            <input
              type="password"
              placeholder="mật khẩu"
              className={`input input-bordered w-full ${loginError ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p className={`${loginError ? "text-downvoted" : "hidden"} pt-2`}>Tài khoản không đúng</p>
          <p className="pt-2">
            Người dùng mới? &nbsp;
            <a
              className="link hover:opacity-100 opacity-90"
              onClick={() => {
                closeModal("login_modal");
                showModal("register_modal");
              }}
            >
              Đăng ký ngay
            </a>
          </p>
          <button type="submit" className="btn btn-outline mt-3" disabled={loading} onClick={handleLogin}>
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
