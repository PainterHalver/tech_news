"use client";
import { useState } from "react";
import axios from "@/lib/axios";
import { useAuthStore } from "@/lib/zustand/AuthStore";
import { User } from "@/lib/types";

export const LoginModal = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", { username, password });
      const data = res.data.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      login(data.user as User);

      const modal = document.getElementById("login_modal");
      (modal as any).close();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="login_modal" className="modal">
      <div className="modal-box flex flex-col no-scrollbar">
        <h3 className="font-bold text-xl text-center text-text-primary">Login</h3>
        <form className="form-control w-full" onSubmit={handleLogin}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Username</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="label">
              <span className="label-text-alt hidden">Bottom Left label</span>
            </div>
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Password</span>
            </div>
            <input
              type="password"
              placeholder="Type here"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="label">
              <span className="label-text-alt hidden">Bottom Left label</span>
            </div>
          </label>
          <p>
            New user? &nbsp;
            <a className="link hover:opacity-100 opacity-90">Register here</a>
          </p>
          <button type="submit" className="btn btn-outline mt-3" disabled={loading} onClick={handleLogin}>
            {loading ? <span className="loading loading-spinner"></span> : "Submit"}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop focus:border-none bg-backdrop">
        <button className="cursor-default">close</button>
      </form>
    </dialog>
  );
};
