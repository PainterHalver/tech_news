import toast from "react-hot-toast";

export const trimString = (str: string, length: number) => {
  if (str.length > length) {
    return `${str.substring(0, length)}...`;
  }

  return str;
};

export const showModal = (id: string) => {
  const modal = document.getElementById(id);
  (modal as any).showModal();
};

export const closeModal = (id: string) => {
  const modal = document.getElementById(id);
  (modal as any).close();
};

export const handleShare = async (postId: string | number) => {
  try {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/posts/${postId}`);
    toast.success("Đã lưu URL vào clipboard");
  } catch (error) {
    toast.error("Có lỗi khi lưu URL vào clipboard");
  }
};

export const avatarLink = (avatar: string | undefined) => {
  if (!avatar) {
    return "/images/default-avatar.jpg";
  }

  if (avatar.startsWith("http")) {
    return avatar;
  }

  return process.env.NEXT_PUBLIC_API_URL + "/avatars/" + avatar;
};
