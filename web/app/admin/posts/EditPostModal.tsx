"use client";
import axios from "@/lib/axios";
import { Post } from "@/lib/types";
import { closeModal } from "@/lib/utils";
import Axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type EditPostErrors = {
  title?: string[];
  description?: string[];
  description_generated?: string[];
  image?: string[];
  link?: string[];
};

type Props = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  selectedPost: Post | null;
};

export const EditPostModal = ({ selectedPost, posts, setPosts }: Props) => {
  const [loading, setLoading] = useState(false);
  const [editErrors, setEditErrors] = useState<EditPostErrors>({});

  const handleEditPost = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      setEditErrors({});
      const { title, description, image, link } = e.target.elements;
      const res = await axios.patch(`/api/posts/${selectedPost?.id}`, {
        title: title.value,
        description: description.value,
        image: image.value,
        link: link.value,
      });

      const postData = res.data.data.post;

      const index = posts.findIndex((post) => post.id === postData.id);
      const newPosts = [...posts];
      newPosts[index] = postData;
      setPosts(newPosts);
      closeModal("edit_post_modal");
      toast.success("Cập nhật tin tức thành công.");
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
    <dialog id="edit_post_modal" className="modal">
      <div className="modal-box flex flex-col no-scrollbar w-6/12 max-w-5xl">
        <h3 className="font-bold text-xl text-center text-text-primary">Chỉnh sửa tin tức</h3>
        <form className="form-control w-full" onSubmit={handleEditPost}>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Tiêu đề</span>
            </div>
            <input
              type="text"
              name="title"
              placeholder="tiêu đề"
              className={`input input-bordered w-full ${editErrors.title ? "input-error" : ""}`}
              defaultValue={selectedPost?.title}
              key={selectedPost?.id}
            />
            {editErrors.title && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.title[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Nội dung tóm tắt</span>
            </div>
            <textarea
              name="description"
              placeholder="nội dung tóm tắt"
              className={`input input-bordered w-full h-36 py-2 ${editErrors.description ? "input-error" : ""}`}
              defaultValue={selectedPost?.description}
              key={selectedPost?.id}
            />
            {editErrors.description && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.description[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Nội dung tóm tắt</span>
            </div>
            <textarea
              name="description_generated"
              placeholder="tóm tắt AI"
              className={`input input-bordered w-full h-36 py-2 ${
                editErrors.description_generated ? "input-error" : ""
              }`}
              defaultValue={selectedPost?.description_generated}
              key={selectedPost?.id}
            />
            {editErrors.description_generated && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.description_generated[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Link ảnh</span>
            </div>
            <input
              type="text"
              name="image"
              placeholder="link ảnh"
              className={`input input-bordered w-full ${editErrors.image ? "input-error" : ""}`}
              defaultValue={selectedPost?.image}
              key={selectedPost?.id}
            />
            {editErrors.image && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.image[0]}</span>
              </div>
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-base">Link bài viết</span>
            </div>
            <input
              type="text"
              name="link"
              placeholder="link bài viết"
              className={`input input-bordered w-full ${editErrors.link ? "input-error" : ""}`}
              defaultValue={selectedPost?.link}
              key={selectedPost?.id}
            />
            {editErrors.link && (
              <div className="label">
                <span className="label-text-alt text-downvoted">{editErrors.link[0]}</span>
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
