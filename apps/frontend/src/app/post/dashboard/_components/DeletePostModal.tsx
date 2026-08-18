"use client";

import { deleteUserPost } from "@/lib/actions/postActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/lib/types/modelTypes";

type DeletePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
};

export default function DeletePostModal({
  isOpen,
  onClose,
  post,
}: DeletePostModalProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => deleteUserPost(post!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      onClose();
    },
  });

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl text-red-600">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Xác nhận xóa bài viết
          </h3>
          <p className="text-gray-500 mb-6">
            Bạn có chắc chắn muốn xóa bài viết{" "}
            <span className="font-semibold text-gray-800">"{post.title}"</span>{" "}
            không? Hành động này không thể hoàn tác.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
              {(error as Error).message || "Đã xảy ra lỗi khi xóa bài viết."}
            </div>
          )}

          <div className="flex gap-3 justify-center mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => mutate()}
              disabled={isPending}
              className={`px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2
                ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isPending ? "⏳ Đang xóa..." : "Vâng, Xóa bài viết"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
