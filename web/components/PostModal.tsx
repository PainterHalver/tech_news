export const PostModal = () => {
  return (
    <dialog id="post_modal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click outside to close</p>
      </div>
      <form method="dialog" className="modal-backdrop focus:border-none">
        <button>close</button>
      </form>
    </dialog>
  );
};
