"use client";

import { updateUserPost } from "@/lib/actions/postActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/lib/types/modelTypes"; // Điều chỉnh lại đường dẫn import này nếu thư mục của bạn khác
import { PostInputData } from "@/lib/types/modelTypes";
import PostForm from "@/components/PostForm";

type EditPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
};

export default function EditPostModal({
  isOpen,
  onClose,
  post,
}: EditPostModalProps) {
  const queryClient = useQueryClient();

  // 1. Cấu hình Mutation để gọi API cập nhật bài viết
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: PostInputData) => updateUserPost(post?.id, data),
    onSuccess: () => {
      // Làm mới danh sách bài viết và đóng Modal khi thành công
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      onClose();
    },
  });

  // Nếu Modal chưa mở hoặc không có dữ liệu bài viết thì không hiển thị gì cả
  if (!isOpen || !post) return null;

  // 2. Chuyển đổi dữ liệu bài viết cũ sang định dạng PostInputData cho Form
  const initialData: PostInputData = {
    title: post.title || "",
    content: post.content || "",
    thumbnail: post.thumbnail || "",
    published: post.published || false,
    tagIds: post.tags?.map((t) => Number(t.id)) || [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Phần đầu Modal (Header) */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Sửa bài viết</h3>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Phần thân Modal (Content) */}
        <div className="p-6 overflow-y-auto">
          {/* 3. Tận dụng lại sức mạnh của PostForm! */}
          <PostForm
            initialData={initialData}
            onSubmit={(data) => mutate(data)}
            isPending={isPending}
            error={error}
            submitLabel="Lưu thay đổi"
          />
        </div>
      </div>
    </div>
  );
}
