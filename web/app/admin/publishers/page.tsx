"use client";

import axios from "@/lib/axios";
import { Paginated, Publisher } from "@/lib/types";
import { useEffect, useState } from "react";
import Paginator from "@/components/Paginator";

const PER_PAGE = 10;

export default function ManagePublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [inputString, setInputString] = useState("");
  const [query, setQuery] = useState("");
  const tablePublishers = publishers.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  const totalPages = Math.ceil(publishers.length / PER_PAGE);

  const fetchPublishers = async (search?: string) => {
    try {
      setFetching(true);
      const res = await axios.get(`/api/publishers?per_page=100000&page=1&search=${search ?? query}`);
      const data = res.data as Paginated<Publisher>;
      setPublishers(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPublishers([]);
    setQuery(inputString);
    fetchPublishers(inputString);
    setPage(1);
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  return (
    <main className="flex flex-col py-5 lg:px-16 px-8 min-h-full gap-4">
      <h1 className="text-xl font-bold">Các nguồn đăng tin</h1>
      <form className="w-full flex gap-4 mb-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm"
          className="input input-bordered input-md w-full max-w-md"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={fetching}>
          {fetching && <span className="loading loading-spinner"></span>} Tìm kiếm
        </button>
      </form>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-md uppercase bg-bg-table-header">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Tên nguồn tin
              </th>
              <th scope="col" className="px-6 py-3">
                Tên đầy đủ
              </th>
              <th scope="col" className="px-6 py-3">
                Số tin tức
              </th>
              <th scope="col" className="px-6 py-3">
                Số lượt theo dõi
              </th>
            </tr>
          </thead>
          <tbody>
            {tablePublishers.map((publisher) => (
              <tr key={publisher.id} className="bg-bg-secondary border-b border-border hover:bg-[#1c1f2699]">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                  {publisher.id}
                </th>
                <td className="px-6 py-3">{publisher.name}</td>
                <td className="px-6 py-3">{publisher.full_name}</td>
                <td className="px-6 py-3">{publisher.posts_count}</td>
                <td className="px-6 py-3">{publisher.followers_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="join mt-3 flex justify-end flex-wrap">
          <Paginator perPage={PER_PAGE} totalPages={totalPages} page={page} setPage={setPage} />
        </div>
      </div>
    </main>
  );
}
