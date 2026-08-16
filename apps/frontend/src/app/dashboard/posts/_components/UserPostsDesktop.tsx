"use client";

import { Post } from "@/lib/types/modelTypes";

type Props = {
  posts: Post[];
  onEditClick: (post: Post) => void;
  onDeleteClick: (post: Post) => void;
};

export default function UserPostsDesktop({
  posts,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <div className="hidden md:block w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
              Hình ảnh
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
              Tiêu đề
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
              Trạng thái
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
              Ngày tạo
            </th>
            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
              Ngày cập nhật
            </th>
            <th className="px-5 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
              Lượt thích
            </th>
            <th className="px-5 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {posts.map((post: Post) => (
            <tr
              key={post.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-5 py-3 whitespace-nowrap">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-16 h-12 object-cover rounded-md border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                    Trống
                  </div>
                )}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {post.title}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-sm">
                {post.published ? (
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-700">
                    Đã xuất bản
                  </span>
                ) : (
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-100 text-yellow-800">
                    Bản nháp
                  </span>
                )}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                {post.updatedAt
                  ? new Date(post.updatedAt).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-500 text-right font-medium">
                {post.likeCount} ❤️
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEditClick(post)}
                  className="text-blue-600 hover:text-blue-800 hover:underline mr-4 transition-all"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDeleteClick(post)}
                  className="text-red-600 hover:text-red-800 hover:underline transition-all"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
