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
    toast.success("Post URL copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy URL");
  }
};
