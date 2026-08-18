"use client";

import { useEffect, useActionState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updatePostAction } from "@/lib/actions/postActions";
import { Post } from "@/lib/types/modelTypes";
import { FormState } from "@/lib/types/formState";
import PostForm from "@/components/PostForm";

type EditPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
};

const initialState: FormState = { success: false, message: "", errors: {} };

export default function EditPostModal({
  isOpen,
  onClose,
  post,
}: EditPostModalProps) {
  const queryClient = useQueryClient();

  // Kết nối với Server Action
  const [state, formAction, isPending] = useActionState(
    updatePostAction,
    initialState,
  );

  // Thành công thì đóng Modal và load lại danh sách
  useEffect(() => {
    if (state?.success) {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      onClose();
    }
  }, [state?.success, onClose, queryClient]);

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
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

        {/* Thân Modal */}
        <div className="p-6 overflow-y-auto">
          {state?.message && !state.success && (
            <div className="mb-4 p-3 rounded-md text-sm bg-red-100 text-red-700">
              {state.message}
            </div>
          )}

          {/* Form gọi Action */}
          <form action={formAction}>
            {/* Truyền ID bài viết để Backend biết đang sửa bài nào */}
            <input
              type="hidden"
              name="postId"
              value={post.id}
            />

            <PostForm
              initialData={post} // Truyền dữ liệu bài viết cũ vào đây
              state={state}
              isPending={isPending}
              submitLabel="Lưu thay đổi"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
