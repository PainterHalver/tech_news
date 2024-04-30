"use client";

type Props = {
  perPage: number;
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
};

export default function Paginator({ totalPages, page, setPage }: Props) {
  if (totalPages < 1) {
    return null;
  }

  let startPage = page <= 3 ? 1 : page >= totalPages - 2 ? totalPages - 4 : page - 2;
  let endPage = page <= 3 ? 5 : page >= totalPages - 2 ? totalPages : page + 2;

  if (totalPages < 5) {
    startPage = 1;
    endPage = totalPages;
  }

  return (
    <div className="join">
      <button className="join-item btn w-20 btn-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>
        Trước
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNumber, buttonIndex) => (
        <button
          key={buttonIndex}
          className={`join-item w-12 btn ${page === pageNumber ? "btn-primary" : ""}`}
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="join-item btn w-20 btn-primary"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Sau
      </button>
    </div>
  );
}
