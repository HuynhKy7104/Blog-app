"use client";

import { Post } from "@/lib/types/modelTypes";

type Props = {
  posts: Post[];
  onEditClick: (post: Post) => void;
  onDeleteClick: (post: Post) => void;
};

// 1. HÀM TIỆN ÍCH: Cắt chuỗi theo số lượng từ (mặc định là 10 từ)
const truncateTitle = (text: string, maxWords: number = 10) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/); // Tách câu thành các từ dựa trên khoảng trắng
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return text;
};

export default function UserPostsDesktop({
  posts,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <div className="hidden md:block w-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Bài viết
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
              Thống kê
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
              Thời gian
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {posts.map((post: Post) => (
            <tr
              key={post.id}
              className="hover:bg-blue-50/50 transition-colors group"
            >
              {/* CỘT 1: THÔNG TIN BÀI VIẾT */}
              <td className="px-6 py-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt="thumbnail"
                        className="w-20 h-14 object-cover rounded-md border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-14 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                        Trống
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      {/* 2. ÁP DỤNG HÀM TRUNCATE TẠI ĐÂY */}
                      <span className="text-sm font-semibold text-gray-900 leading-snug wrap-break-words">
                        {truncateTitle(post.title, 10)}
                      </span>

                      {post.published ? (
                        <span className="shrink-0 px-2 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded bg-green-100 text-green-700 uppercase tracking-wide w-max">
                          Xuất bản
                        </span>
                      ) : (
                        <span className="shrink-0 px-2 py-0.5 inline-flex text-[10px] leading-4 font-bold rounded bg-yellow-100 text-yellow-800 uppercase tracking-wide w-max">
                          Bản nháp
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {post.tags && post.tags.length > 0 ? (
                        <>
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded text-xs"
                            >
                              #{tag.name}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-xs font-medium">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          Chưa phân loại
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </td>

              {/* CỘT 2: THỐNG KÊ */}
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">👁️</span>
                    <span className="font-medium">{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">❤️</span>
                    <span className="font-medium">{post.likeCount}</span>
                  </div>
                </div>
              </td>

              {/* CỘT 3: THỜI GIAN */}
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="flex flex-col gap-1 text-sm">
                  <div className="text-gray-900 font-medium">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Sửa:{" "}
                    {post.updatedAt
                      ? new Date(post.updatedAt).toLocaleDateString("vi-VN")
                      : "---"}
                  </div>
                </div>
              </td>

              {/* CỘT 4: THAO TÁC */}
              <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onEditClick(post)}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-all"
                  >
                    Sửa bài
                  </button>
                  <button
                    onClick={() => onDeleteClick(post)}
                    className="text-red-600 hover:text-red-800 hover:underline transition-all"
                  >
                    Xóa bài
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
