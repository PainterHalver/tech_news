import React from "react";

const HistoryPostCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-bg-secondary hover:border-border-hover border border-border rounded-2xl overflow-hidden hover:cursor-pointer px-3 py-4 w-full md:w-[45rem]">
      <div className="flex items-center">
        <div className="ml-2 my-2 skeleton w-10 h-10 rounded-full shrink-0 mr-2"></div>
        <div className="w-full">
          <div className="skeleton h-5 w-full"></div>
          <div className="skeleton h-4 w-64 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPostCardSkeleton;
