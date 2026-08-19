"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import PostSearchBar from "./PostSearchBar";
import SortSelect from "./SortSelect";
import { useDebounce } from "@/hooks/useDebounce";

// 1. Định nghĩa kiểu dữ liệu cho danh sách truyền vào
type FilterItem = {
  id: number | string;
  name: string;
};

type HomeFilterBarProps = {
  tags?: FilterItem[];
  authors?: FilterItem[];
};

export default function HomeFilterBar({
  tags = [],
  authors = [],
}: HomeFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialSortBy = searchParams.get("sortBy") || "NEWEST";
  const initialAuthorId = searchParams.get("authorId") || "ALL";
  const initialTagId = searchParams.get("tagId") || "ALL";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "ALL") params.set(key, value);
    else params.delete(key);

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (debouncedSearch !== initialSearch) {
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch, pathname, router, searchParams, initialSearch]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-8">
      {/* 
        Sử dụng flex-wrap để tự động rớt dòng trên màn hình nhỏ.
        items-end giúp tất cả các ô input và select luôn thẳng hàng ở đáy.
      */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
        {/* 1. Ô Tìm kiếm (flex-1 giúp nó chiếm nhiều không gian nhất) */}
        <div className="flex flex-col gap-1.5 flex-1 w-full min-w-62.5">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
            Tìm kiếm bài viết
          </label>
          <div className="w-full">
            <PostSearchBar
              value={searchTerm}
              onChange={(val) => setSearchTerm(val)}
              placeholder="Nhập từ khóa..."
            />
          </div>
        </div>

        {/* 2. Ô Thể loại */}
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
            Thể loại
          </label>
          <select
            value={initialTagId}
            onChange={(e) => handleFilterChange("tagId", e.target.value)}
            className="h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors cursor-pointer min-w-37.5"
          >
            <option value="ALL">Tất cả thể loại</option>
            {tags?.map((tag) => (
              <option
                key={tag.id}
                value={tag.id.toString()}
              >
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Ô Tác giả */}
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
            Tác giả
          </label>
          <select
            value={initialAuthorId}
            onChange={(e) => handleFilterChange("authorId", e.target.value)}
            className="h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors cursor-pointer min-w-37.5"
          >
            <option value="ALL">Tất cả tác giả</option>
            {authors?.map((author) => (
              <option
                key={author.id}
                value={author.id.toString()}
              >
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Ô Sắp xếp */}
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
            Sắp xếp
          </label>
          <div className="w-full sm:w-auto">
            <SortSelect
              value={initialSortBy}
              onChange={(val) => handleFilterChange("sortBy", val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
