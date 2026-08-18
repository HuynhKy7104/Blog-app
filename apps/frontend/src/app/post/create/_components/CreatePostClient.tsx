"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserPost } from "@/lib/actions/postActions";
import PostForm from "@/components/PostForm"; // Đảm bảo đường dẫn này đúng
import { PostInputData } from "@/lib/types/modelTypes";

export default function CreatePostClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Khai báo Mutation để Tạo bài viết
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: PostInputData) => createUserPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      alert("Tạo bài viết thành công!");
      router.push("/post/dashboard");
    },
  });

  return (
    <PostForm
      onSubmit={(data) => mutate(data)}
      isPending={isPending}
      error={error}
      submitLabel="Tạo bài viết ngay"
    />
  );
}
