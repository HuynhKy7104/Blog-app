"use client";

import { useState, useEffect, Suspense } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPostComments } from "@/lib/actions/commentActions";
import Pagination from "@/components/pagination";
import { CommentEntity } from "@/lib/types/modelTypes";
import AddComment from "./addComment";

type Props = {
  postId: number;
  isLoggedIn: boolean;
  currentUser?: {
    name?: string;
    avatar?: string;
  };
};

export default function CommentSection({ postId, isLoggedIn, currentUser }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["comments", postId, page],
    queryFn: () => getPostComments({ postId, page, pageSize }),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setPage(1);
  }, [postId]);

  const comments = data?.comments || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  console.log("=== DỮ LIỆU BÌNH LUẬN ===", comments);

  if (isError) {
    return (
      <div className="text-red-500 py-8 text-center">
        Đã xảy ra lỗi khi tải bình luận.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Bình luận</h3>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {totalCount}
        </span>
      </div>

      <AddComment
        postId={postId}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
      />

      <div className="flex flex-col gap-6 min-h-75">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">
            ⏳ Đang tải bình luận...
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment: CommentEntity) => (
            <div
              key={comment.id}
              className="flex gap-4"
            >
              {/* 2. Cập nhật Avatar: Sử dụng ảnh thật nếu có */}
              <Avatar className="w-10 h-10 border border-gray-200 shrink-0">
                <AvatarImage
                  src={comment.author.avatar || ""}
                  alt={comment.author.name || "Avatar"}
                />
                <AvatarFallback className="bg-primary-600 text-white font-bold">
                  {comment.author.name
                    ? comment.author.name.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {comment.author.name || "Người dùng ẩn danh"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            Chưa có bình luận nào cho bài viết này.
          </div>
        )}
      </div>

      {/* 3. Tích hợp Pagination đa năng */}
      {totalPages > 1 && (
        <Suspense fallback={null}>
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Suspense>
      )}
    </div>
  );
}
