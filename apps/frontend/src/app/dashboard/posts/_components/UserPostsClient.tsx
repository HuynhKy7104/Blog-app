"use client";

import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchUserPosts } from "@/lib/actions/postActions";
import Pagination from "@/components/pagination";
import UserPostsMobile from "./UserPostsMobile";
import UserPostsDesktop from "./UserPostsDesktop";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import { Post } from "@/lib/types/modelTypes";
import PostSearchBar from "@/components/filter/PostSearchBar";
import PostFilterBar from "@/components/filter/UserPostFilterBar";
import { DEFAULT_POSTS_SIZE } from "@/lib/constants";

export default function UserPostsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = DEFAULT_POSTS_SIZE;

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingPost, setEditingPost] = useState<Post>();
  const [deletingPost, setDeletingPost] = useState<Post>();

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortBy, startDate, endDate]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userPosts", page, search, statusFilter, sortBy, startDate, endDate],
    queryFn: () => {
      const isoStartDate = startDate ? new Date(startDate).toISOString() : undefined;

      let isoEndDate = undefined;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        isoEndDate = end.toISOString();
      }

      return fetchUserPosts({
        page,
        pageSize,
        search,
        status: statusFilter,
        sortBy,
        startDate: isoStartDate,
        endDate: isoEndDate,
      });
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const posts = data?.posts || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
  };

  const handleDeleteClick = (post: Post) => {
    setDeletingPost(post);
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
      {/* THANH ĐIỀU KHIỂN CHÍNH */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 w-full mb-6 flex flex-col gap-4">
        {/* HÀNG 1: Tiêu đề ở trái | Tìm kiếm & Nút tạo mới ở phải */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          {/* Tiêu đề và tổng số bài */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-md text-sm font-semibold shadow-sm">
              Tổng cộng: {totalCount} bài
            </span>
          </div>

          {/* Nhóm bên phải: Thanh tìm kiếm và Nút viết bài */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-auto">
              <PostSearchBar
                value={search}
                onChange={setSearch}
                placeholder="Tìm kiếm bài viết..."
              />
            </div>

            {/* Thêm w-full sm:w-auto để nút bấm rộng hết cỡ trên điện thoại */}
            <button className="w-full sm:w-auto shrink-0 h-10 px-5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center font-medium shadow-sm whitespace-nowrap">
              + Viết bài mới
            </button>
          </div>
        </div>

        {/* HÀNG 2: Khu vực chứa các bộ lọc (Trạng thái, Sắp xếp, Khoảng thời gian) */}
        <div className="pt-3 border-t border-gray-100 flex items-center w-full">
          <PostFilterBar
            status={statusFilter}
            onChangeStatus={setStatusFilter}
            sortBy={sortBy}
            onChangeSortBy={setSortBy}
            startDate={startDate}
            onChangeStartDate={setStartDate}
            endDate={endDate}
            onChangeEndDate={setEndDate}
          />
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
              onDeleteClick={handleDeleteClick}
            />
            <UserPostsDesktop
              posts={posts}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
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
        onClose={() => setEditingPost(undefined)}
      />

      {/* HỘP THOẠI XÓA BÀI VIẾT */}
      <DeletePostModal
        isOpen={!!deletingPost}
        post={deletingPost as Post}
        onClose={() => setDeletingPost(undefined)}
      />
    </div>
  );
}
