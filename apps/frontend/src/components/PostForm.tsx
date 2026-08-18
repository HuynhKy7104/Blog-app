"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllTags } from "@/lib/actions/tagActions";
import { uploadThumbnailAction } from "@/lib/upload";
import { PostInputData } from "@/lib/types/modelTypes";

type PostFormProps = {
  initialData?: PostInputData; // Dữ liệu cũ (nếu có)
  onSubmit: (data: PostInputData) => void; // Hàm xử lý khi submit
  isPending: boolean; // Trạng thái đang lưu (loading)
  submitLabel?: string; // Tên nút bấm (vd: "Tạo bài viết" hoặc "Lưu thay đổi")
  error?: Error | null; // Lỗi từ mutation (nếu có)
};

export default function PostForm({
  initialData,
  onSubmit,
  isPending,
  submitLabel = "Lưu bài viết",
  error,
}: PostFormProps) {
  // 1. Khởi tạo State với dữ liệu ban đầu (nếu có)
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    initialData?.tagIds || [],
  );

  const [isUploading, setIsUploading] = useState(false);

  // 2. Fetch danh sách Thể loại (Tags)
  const { data: allTags, isLoading: isTagsLoading } = useQuery({
    queryKey: ["allTags"],
    queryFn: fetchAllTags,
  });

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  // 3. Hàm xử lý khi bấm Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      thumbnail,
      published,
      tagIds: selectedTagIds,
    });
  };

  // Trả về toàn bộ giao diện Form (Đã được tách từ EditPostModal)
  return (
    <div className="flex flex-col gap-6 w-full">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {error.message || "Đã xảy ra lỗi khi lưu bài viết."}
        </div>
      )}

      <form
        id="post-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        {/* Tiêu đề */}
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
            placeholder="Nhập tiêu đề..."
          />
        </div>

        {/* Upload Ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh thu nhỏ (Thumbnail)
          </label>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Dán liên kết ảnh hoặc tải lên ở dưới"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <label
              className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg transition
                ${isUploading ? "border-blue-400 bg-blue-50 cursor-not-allowed" : "border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100"}`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="text-2xl mb-1">{isUploading ? "⏳" : "📁"}</span>
                <span
                  className={`text-xs font-semibold ${isUploading ? "text-blue-600 animate-pulse" : "text-blue-600"}`}
                >
                  {isUploading ? "Đang tải ảnh lên..." : "Nhấn để tải ảnh lên"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      setIsUploading(true);
                      const formData = new FormData();
                      formData.append("image", file);
                      const uploadedUrl = await uploadThumbnailAction(formData);
                      setThumbnail(uploadedUrl);
                    } catch (err) {
                      console.error("Lỗi upload:", err);
                      alert("Tải ảnh thất bại!");
                    } finally {
                      setIsUploading(false);
                      e.target.value = "";
                    }
                  }
                }}
              />
            </label>

            {thumbnail && (
              <img
                src={thumbnail}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md border border-gray-200 mt-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
        </div>

        {/* Nội dung */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung
          </label>
          <textarea
            rows={6}
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Nhập nội dung..."
          ></textarea>
        </div>

        {/* Thể loại */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thể loại
          </label>
          <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-md bg-gray-50 max-h-32 overflow-y-auto">
            {isTagsLoading ? (
              <span className="text-sm text-gray-500">Đang tải...</span>
            ) : (
              allTags?.map((tag: any) => {
                const isSelected = selectedTagIds.includes(Number(tag.id));
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(Number(tag.id))}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 hover:border-indigo-400"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {tag.name}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Trạng thái xuất bản */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor="published"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Xuất bản bài viết này (Công khai)
          </label>
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isPending || isUploading}
          className={`mt-4 px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition flex items-center justify-center
            ${isPending || isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isPending ? "⏳ Đang xử lý..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
