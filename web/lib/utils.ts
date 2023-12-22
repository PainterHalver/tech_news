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
