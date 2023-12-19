export default function PostSkeleton() {
  return (
    <main className="flex min-h-full justify-center flex-col md:flex-row">
      <main className="border-[0.5px] border-border flex-1 flex flex-col max-w-3xl">
        <div className="skeleton w-full h-60 rounded-none"></div>
        <div className="flex flex-col px-5 py-7 gap-4">
          <h1 className="skeleton w-3/4 h-10 rounded-lg"></h1>
          <p className="skeleton w-1/4 h-5 rounded-lg"></p>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton w-full h-5 rounded-lg"></div>
          ))}
          <div className="skeleton w-[80%] h-5 rounded-lg"></div>
        </div>
        <div className="flex justify-between border-y border-border py-2 px-5">
          <div className="flex items-center gap-2 group hover:cursor-pointer hover:text-[chocolate] btn btn-ghost btn-md">
            <div className="skeleton w-10 h-10 rounded-full"></div>
            <p className="skeleton w-10 h-5 rounded-lg"></p>
          </div>
          <div className="flex items-center gap-2 group hover:cursor-pointer hover:text-[chocolate] btn btn-ghost btn-md">
            <div className="skeleton w-10 h-10 rounded-full"></div>
            <p className="skeleton w-10 h-5 rounded-lg"></p>
          </div>
          <div className="flex items-center gap-2 group hover:cursor-pointer hover:text-[chocolate] btn btn-ghost btn-md">
            <div className="skeleton w-10 h-10 rounded-full"></div>
            <p className="skeleton w-10 h-5 rounded-lg"></p>
          </div>
        </div>

        <div className="mx-10 my-6 flex flex-col gap-5">
          <div className="skeleton w-full h-10 rounded-lg"></div>
          <div className="skeleton w-full h-10 rounded-lg"></div>
          <div className="skeleton w-full h-10 rounded-lg"></div>
        </div>
      </main>

      <aside className="border-[0.5px] border-border w-full md:w-72 flex flex-col px-3 py-5 gap-5">
        <div className="skeleton h-4 w-full"></div>
        <div className="border border-border rounded-2xl flex">
          <div className="h-fit pl-2 py-2 flex items-center mr-2">
            <div className="skeleton w-10 h-10 rounded-full"></div>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <span className="skeleton h-4 w-36"></span>
            <span className="skeleton h-3 w-20"></span>
          </div>
        </div>
      </aside>
    </main>
  );
}
