"use client";

export default function LoginButton() {
  return (
    <div className="mr-5">
      <button
        className="btn btn-sm border btn-outline"
        onClick={() => {
          const modal = document.getElementById("login_modal");
          (modal as any).showModal();
        }}
      >
        Login
      </button>
    </div>
  );
}
