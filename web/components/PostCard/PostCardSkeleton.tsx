export const PostCardSkeleton = () => {
  return (
    <div className="flex flex-col w-[20rem] h-[25rem] text-xs bg-bg-secondary hover:border-border-hover border border-border rounded-2xl overflow-hidden hover:cursor-pointer">
      <div className="skeleton h-[150px] w-full rounded-none"></div>
      <div className="ml-2 my-2 skeleton w-10 h-10 rounded-full shrink-0"></div>
      <div className="skeleton h-4 w-28 ml-2 mb-3"></div>
      <div className="skeleton h-5 mx-2 mb-2"></div>
      <div className="skeleton h-5 mx-2 mb-2"></div>
      <div className="skeleton h-5 mx-2 w-40"></div>
      <div className="px-3 mt-auto border-t border-border flex items-center py-3">
        <div className="skeleton h-6 w-28 ml-2"></div>
      </div>
    </div>
  );
};
