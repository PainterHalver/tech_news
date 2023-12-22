"use client";
import { showModal } from "@/lib/utils";
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
      toast.error("Unable to login. Please try again.");
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
              className={`input input-bordered w-full ${loginError ? "input-error" : ""}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Password</span>
            </div>
            <input
              type="password"
              placeholder="Type here"
              className={`input input-bordered w-full ${loginError ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p className={`${loginError ? "text-downvoted" : "hidden"} pt-2`}>Invalid credentials</p>
          <p className="pt-2">
            New user? &nbsp;
            <form method="dialog" className="inline">
              <button className="link hover:opacity-100 opacity-90" onClick={() => showModal("register_modal")}>
                Register here
              </button>
            </form>
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
