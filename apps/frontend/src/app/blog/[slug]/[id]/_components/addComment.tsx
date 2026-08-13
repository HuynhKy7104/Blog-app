"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { getLoginUrl } from "@/lib/router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  postId: number;
  isLoggedIn: boolean;
  currentUser?: {
    name?: string;
    avatar?: string;
  };
};

export default function AddComment({ postId, isLoggedIn, currentUser }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const { mutate, isPending } = useMutation({
    mutationFn: async (newContent: string) => {
      // Bỏ comment dòng dưới khi đã gắn API Action
      // return await createCommentAction({ postId, content: newContent });
    },
    onSuccess: () => {
      setContent("");
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Lỗi khi đăng bình luận: ", error);
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!isLoggedIn && open) {
      alert("Vui lòng đăng nhập để bình luận!");

      router.push(getLoginUrl(pathname));

      return;
    }

    setIsOpen(open);
  };

  return (
    <div className="mb-8">
      {/* Gắn hàm handleOpenChange vào Dialog để kiểm soát việc mở */}
      <Dialog
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <DialogTrigger>
          <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser?.avatar || ""} />
              <AvatarFallback className="bg-primary-600 text-white text-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>

            {/* KIỂM TRA ĐỂ HIỂN THỊ CHỮ PHÙ HỢP */}
            <span className="text-gray-500 text-sm">
              {isLoggedIn
                ? "Viết bình luận của bạn..."
                : "Đăng nhập để bình luận..."}
            </span>
          </div>
        </DialogTrigger>

        {/* PHẦN MODAL CHỈ HIỆN KHI ĐÃ ĐĂNG NHẬP */}
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Viết bình luận
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-gray-900"
              placeholder="Chia sẻ suy nghĩ của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                onClick={() => mutate(content)}
                disabled={isPending || !content.trim()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {isPending ? "Đang đăng..." : "Đăng bình luận"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
