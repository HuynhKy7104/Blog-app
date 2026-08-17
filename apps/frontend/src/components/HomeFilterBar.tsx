"use client";

import React from "react";

type HomeFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  selectedTagId: number | null;
  onTagChange: (tagId: number | null) => void;
  authorId: number | null;
  onAuthorChange: (authorId: number | null) => void;
  // Dữ liệu mẫu truyền vào để render danh sách (Sau này lấy từ API)
  availableTags: { id: number; name: string }[];
  availableAuthors: { id: number; name: string }[];
};

export default function HomeFilterBar({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  selectedTagId,
  onTagChange,
  authorId,
  onAuthorChange,
  availableTags = [],
  availableAuthors = [],
}: HomeFilterBarProps) {
  return (
    <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-8 shadow-sm">
      {/* Hàng 1: Tìm kiếm, Tác giả và Sắp xếp */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Ô Tìm kiếm */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-400"
          />
        </div>

        {/* Lọc theo Tác giả */}
        <select
          value={authorId || ""}
          onChange={(e) =>
            onAuthorChange(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full md:w-48 py-2 px-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 [&>option]:text-gray-900"
        >
          <option value="">Tất cả tác giả</option>
          {availableAuthors.map((author) => (
            <option
              key={author.id}
              value={author.id}
            >
              {author.name}
            </option>
          ))}
        </select>

        {/* Sắp xếp */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full md:w-48 py-2 px-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 [&>option]:text-gray-900"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="most_comments">Phổ biến nhất</option>
          <option value="most_likes">Yêu thích nhất</option>
        </select>
      </div>

      {/* Hàng 2: Danh sách Thể loại (Tags) thao tác nhanh */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
        <span className="text-sm text-gray-400 font-medium mr-2">Chủ đề:</span>

        <button
          onClick={() => onTagChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedTagId === null
              ? "bg-primary-600 text-white shadow-md shadow-primary-900/50"
              : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
          }`}
        >
          Tất cả
        </button>

        {availableTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagChange(tag.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedTagId === tag.id
                ? "bg-primary-600 text-white shadow-md shadow-primary-900/50"
                : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
