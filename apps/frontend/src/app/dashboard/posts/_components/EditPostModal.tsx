"use client";

import { useState, useEffect } from "react";
import { updateUserPost } from "@/lib/actions/postActions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/lib/types/modelTypes";

type EditPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onSuccess: () => void;
};

export default function EditPostModal({
  isOpen,
  onClose,
  post,
}: EditPostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [published, setPublished] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (post && isOpen) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setThumbnail(post.thumbnail || "");
      setPublished(post.published || false);
    }
  }, [post, isOpen]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      updateUserPost(post?.id, { title, content, thumbnail, published }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      onClose();
    },
  });

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Tiêu đề Modal */}
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

        {/* Thân Modal (Form) */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
              {(error as Error).message || "Đã xảy ra lỗi khi lưu bài viết."}
            </div>
          )}

          <form
            id="edit-post-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Liên kết ảnh thu nhỏ (URL)
              </label>
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung
              </label>
              <textarea
                rows={5}
                value={content}
                required
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                placeholder="Nhập nội dung bài viết..."
              ></textarea>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="published"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Xuất bản bài viết này (Công khai)
              </label>
            </div>
          </form>
        </div>

        {/* Chân Modal (Nút bấm) */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="edit-post-form"
            disabled={isPending}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2
        ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isPending ? "⏳ Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
