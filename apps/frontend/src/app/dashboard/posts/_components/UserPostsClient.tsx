"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchUserPosts } from "@/lib/actions/postActions";
import Pagination from "@/components/pagination";
import UserPostsMobile from "./UserPostsMobile";
import UserPostsDesktop from "./UserPostsDesktop";
import EditPostModal from "./EditPostModal";
import { Post } from "@/lib/types/modelTypes";

export default function UserPostsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userPosts", page, search],
    queryFn: () => fetchUserPosts({ page, pageSize, search }),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const posts = data?.posts || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
  };

  if (isError) {
    return (
      <div className="p-4 md:p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        Đã xảy ra lỗi khi tải dữ liệu: {error?.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full min-w-0 mt-20">
      {/* THANH ĐIỀU KHIỂN */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm w-max">
            Tổng cộng: {totalCount} bài
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center font-medium shadow-sm whitespace-nowrap">
            + Viết bài mới
          </button>
        </div>
      </div>

      {/* KHU VỰC DỮ LIỆU */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 w-full overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl animate-spin">⏳</span>
            <p>Đang tải danh sách bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            {search
              ? "Không tìm thấy bài viết nào phù hợp với từ khóa của bạn."
              : "Bạn chưa có bài viết nào. Hãy tạo bài viết đầu tiên nhé!"}
          </div>
        ) : (
          <>
            <UserPostsMobile
              posts={posts}
              onEditClick={handleEditClick}
            />
            <UserPostsDesktop
              posts={posts}
              onEditClick={handleEditClick}
            />
          </>
        )}
      </div>

      {/* HIỂN THỊ PHÂN TRANG */}
      {posts.length > 0 && (
        <div className="flex justify-center w-full pb-4">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* HỘP THOẠI SỬA BÀI VIẾT */}
      <EditPostModal
        isOpen={!!editingPost}
        post={editingPost as Post}
        onClose={() => setEditingPost(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
