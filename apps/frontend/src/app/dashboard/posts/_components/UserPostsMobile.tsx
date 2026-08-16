"use client";

import { Post } from "@/lib/types/modelTypes";

type Props = {
  posts: Post[];
  onEditClick: (post: Post) => void;
  onDeleteClick: (post: Post) => void;
};

export default function UserPostsMobile({
  posts,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <div className="md:hidden divide-y divide-gray-100">
      {posts.map((post: Post) => (
        <div
          key={post.id}
          className="p-4 flex gap-3 hover:bg-gray-50 transition-colors"
        >
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-16 h-12 object-cover rounded-md border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-16 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400 shrink-0">
              Trống
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {post.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {post.published ? (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-green-100 text-green-700">
                  Đã xuất bản
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-yellow-100 text-yellow-800">
                  Bản nháp
                </span>
              )}
              <span className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 font-medium">
                {post.likeCount} ❤️
              </span>
              <div className="flex gap-4 text-sm font-medium">
                <button
                  onClick={() => onEditClick(post)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDeleteClick(post)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
