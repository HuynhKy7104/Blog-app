"use client";

import { Post } from "@/lib/types/modelTypes";

type Props = {
  posts: Post[];
  onEditClick: (post: Post) => void;
  onDeleteClick: (post: Post) => void;
};

// 1. HÀM TIỆN ÍCH: Cắt chuỗi tối đa 10 chữ (Từ Desktop mang sang)
const truncateTitle = (text: string, maxWords: number = 10) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
};

export default function UserPostsMobile({
  posts,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <div className="md:hidden divide-y divide-gray-100 overflow-hidden">
      {posts.map((post: Post) => (
        <div
          key={post.id}
          className="p-4 flex gap-3 hover:bg-gray-50 transition-colors w-full"
        >
          {/* HÌNH ẢNH */}
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt="thumbnail"
              className="w-16 h-12 object-cover rounded-md border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-16 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400 shrink-0">
              Trống
            </div>
          )}

          {/* NỘI DUNG */}
          <div className="flex-1 min-w-0">
            {/* TIÊU ĐỀ: Dùng JS để cắt 10 chữ, dùng CSS để ép xuống dòng */}
            <p className="text-sm font-medium text-gray-900 wrap-break-words whitespace-normal leading-snug">
              {truncateTitle(post.title, 10)}
            </p>

            {/* TRẠNG THÁI & NGÀY THÁNG (Thêm flex-wrap để chống tràn) */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {post.published ? (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-green-100 text-green-700">
                  Đã xuất bản
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-yellow-100 text-yellow-800">
                  Bản nháp
                </span>
              )}
              <span className="text-[11px] text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>

            {/* KHU VỰC THỐNG KÊ, THỂ LOẠI & NÚT BẤM */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-2.5">
              {/* Nhóm Thống kê & Thể loại */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Lượt xem & Thích */}
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span>{post.views} 👁️</span>
                  <span>{post.likeCount} ❤️</span>
                </div>

                {/* Thể loại: Giới hạn tối đa 2 */}
                <div className="flex flex-wrap items-center gap-1">
                  {post.tags && post.tags.length > 0 ? (
                    <>
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[10px] font-medium"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-[10px] font-medium">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">Chưa có</span>
                  )}
                </div>
              </div>

              {/* Nhóm Thao tác: Sẽ tự động nhảy xuống dưới nếu màn hình quá chật */}
              <div className="flex gap-4 text-sm font-medium self-end">
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
