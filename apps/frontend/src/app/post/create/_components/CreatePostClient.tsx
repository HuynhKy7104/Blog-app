"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createPostAction } from "@/lib/actions/postActions";
import { FormState } from "@/lib/types/formState";
import PostForm from "@/components/PostForm";

const initialState: FormState = { success: false, message: "", errors: {} };

export default function CreatePostClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Kết nối với Server Action Tạo bài viết
  const [state, formAction, isPending] = useActionState(
    createPostAction,
    initialState,
  );

  useEffect(() => {
    if (state?.success) {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      alert("Tạo bài viết thành công!");
      router.push("/post/dashboard"); // Đưa người dùng về trang danh sách
    }
  }, [state?.success, router, queryClient]);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Viết bài mới</h2>

      {state?.message && !state.success && (
        <div className="mb-5 p-3 rounded-md text-sm font-medium bg-red-100 text-red-700">
          {state.message}
        </div>
      )}

      {/* Bọc PostForm bằng thẻ form */}
      <form action={formAction}>
        <PostForm
          // Không có initialData vì là tạo mới
          state={state}
          isPending={isPending}
          submitLabel="Tạo bài viết ngay"
        />
      </form>
    </div>
  );
}
