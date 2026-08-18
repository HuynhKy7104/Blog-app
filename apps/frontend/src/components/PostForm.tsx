"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllTags } from "@/lib/actions/tagActions";
import { uploadThumbnailAction } from "@/lib/upload";
import { FormState } from "@/lib/types/formState";
import { Post } from "@/lib/types/modelTypes";

export type PostFormProps = {
  initialData?: Partial<Post>;
  state: FormState;
  isPending: boolean;
  submitLabel?: string;
};

export default function PostForm({
  initialData,
  state,
  isPending,
  submitLabel = "Lưu bài viết",
}: PostFormProps) {
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    initialData?.tags?.map((t: any) => Number(t.id)) || [],
  );
  const [isUploading, setIsUploading] = useState(false);

  const { data: allTags, isLoading: isTagsLoading } = useQuery({
    queryKey: ["allTags"],
    queryFn: fetchAllTags,
  });

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* --- TRƯỜNG TIÊU ĐỀ --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề bài viết <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title" // Bắt buộc phải có name="title" để Form tự gom dữ liệu
          defaultValue={initialData?.title || ""}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Nhập tiêu đề..."
        />
        {/* Nếu Zod báo lỗi tiêu đề, hiển thị màu đỏ ở đây */}
        {state?.errors?.title && (
          <p className="mt-1 text-sm text-red-500 font-medium">
            {state.errors.title[0]}
          </p>
        )}
      </div>

      {/* --- TRƯỜNG SLUG (ĐƯỜNG DẪN) --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Đường dẫn (Slug)
        </label>
        <input
          type="text"
          name="slug"
          defaultValue={initialData?.slug || ""}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="vi-du-bai-viet (Tùy chọn)"
        />
        {state?.errors?.slug && (
          <p className="mt-1 text-sm text-red-500 font-medium">
            {state.errors.slug[0]}
          </p>
        )}
      </div>

      {/* --- TRƯỜNG UPLOAD ẢNH THU NHỎ --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ảnh thu nhỏ (Thumbnail)
        </label>
        <div className="flex flex-col gap-3">
          {/* ĐÂY LÀ THẺ ẨN: Lưu giá trị link ảnh để gửi lên Server */}
          <input
            type="hidden"
            name="thumbnail"
            value={thumbnail}
          />

          {/* Ô nhập link ảnh thủ công */}
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="Dán liên kết ảnh hoặc tải lên ở dưới"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
          />

          {/* Nút bấm để tải ảnh từ máy tính lên */}
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
                    setThumbnail(uploadedUrl); // Cập nhật state ảnh
                  } catch (err) {
                    console.error("Lỗi upload:", err);
                    alert("Tải ảnh thất bại!");
                  } finally {
                    setIsUploading(false);
                    e.target.value = ""; // Reset file input
                  }
                }
              }}
            />
          </label>

          {/* Hiển thị ảnh xem trước */}
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
          {state?.errors?.thumbnail && (
            <p className="mt-1 text-sm text-red-500 font-medium">
              {state.errors.thumbnail[0]}
            </p>
          )}
        </div>
      </div>

      {/* --- TRƯỜNG NỘI DUNG --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nội dung <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          rows={6}
          defaultValue={initialData?.content || ""}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Nhập nội dung..."
        ></textarea>
        {state?.errors?.content && (
          <p className="mt-1 text-sm text-red-500 font-medium">
            {state.errors.content[0]}
          </p>
        )}
      </div>

      {/* --- TRƯỜNG CHỌN THỂ LOẠI (TAGS) --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thể loại
        </label>

        {/* CÁC THẺ ẨN: Trình duyệt sẽ tự động gom các ID Thể loại này gửi lên Server */}
        {selectedTagIds.map((id) => (
          <input
            key={id}
            type="hidden"
            name="tagIds"
            value={id}
          />
        ))}

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

      {/* --- TRƯỜNG TRẠNG THÁI XUẤT BẢN --- */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={initialData?.published || false}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label
          htmlFor="published"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Xuất bản bài viết này (Công khai)
        </label>
      </div>

      {/* --- NÚT SUBMIT --- */}
      <button
        type="submit"
        disabled={isPending || isUploading}
        className={`mt-4 px-4 py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition flex items-center justify-center
          ${isPending || isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isPending ? "⏳ Đang xử lý..." : submitLabel}
      </button>
    </div>
  );
}
