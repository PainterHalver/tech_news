"use client";

import axios from "@/lib/axios";
import { Paginated, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { EditUserModal } from "./EditUserModal";
import { showModal } from "@/lib/utils";
import Paginator from "@/components/Paginator";

const PER_PAGE = 10;

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [inputString, setInputString] = useState("");
  const [query, setQuery] = useState("");
  const tableUsers = users.slice(PER_PAGE * (page - 1), PER_PAGE * page);
  const totalPages = Math.ceil(users.length / PER_PAGE);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async (search?: string) => {
    try {
      setFetching(true);
      const res = await axios.get(`/api/users?per_page=100000&page=1&search=${search ?? query}`);
      const users = res.data as Paginated<User>;
      setUsers((prev) => [...prev, ...users.data]);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setUsers([]);
    setQuery(inputString);
    fetchUsers(inputString);
    setPage(1);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="flex flex-col py-5 lg:px-16 px-8 min-h-full gap-4">
      <h1 className="text-xl font-bold">Quản lý người dùng</h1>
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
                Tên người dùng
              </th>
              <th scope="col" className="px-6 py-3">
                Tên đầy đủ
              </th>
              <th scope="col" className="px-6 py-3">
                Phân quyền
              </th>
              <th scope="col" className="px-6 py-3">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {tableUsers.map((user) => (
              <tr key={user.id} className="bg-bg-secondary border-b border-border hover:bg-[#1c1f2699]">
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                  {user.id}
                </th>
                <td className="px-6 py-3">{user.username}</td>
                <td className="px-6 py-3">{user.full_name}</td>
                <td className="px-6 py-3">{user.role === "admin" ? "Quản trị viên" : "Người dùng"}</td>
                <td className="px-6 py-3 flex gap-3">
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={user.role === "admin"}
                    onClick={() => {
                      setSelectedUser(user);
                      showModal("edit_user_modal");
                    }}
                  >
                    Sửa
                  </button>
                  {/* <button className="btn btn-error btn-sm" disabled={user.role === "admin"}>
                    Xóa
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="join mt-3 flex justify-end flex-wrap">
          <div className="join mt-3 flex justify-end flex-wrap">
            <Paginator perPage={PER_PAGE} totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        </div>
      </div>

      <EditUserModal selectedUser={selectedUser} users={users} setUsers={setUsers} />
    </main>
  );
}
