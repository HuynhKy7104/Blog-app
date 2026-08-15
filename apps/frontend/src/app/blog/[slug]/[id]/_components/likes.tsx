"use client";

import { likePost } from "@/lib/actions/postActions";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface LikesProps {
  postId: number;
  initialLikeCount: number;
  initialIsLiked: boolean;
  isLoggedIn: boolean;
}

export default function Likes({
  postId,
  initialLikeCount,
  initialIsLiked,
  isLoggedIn,
}: LikesProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const router = useRouter();
  const pathname = usePathname();

  const encodedCallback = encodeURIComponent(pathname);

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để thả tim bài viết này!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      setTimeout(() => {
        router.push(`/auth/signIn?callbackUrl=${encodedCallback}`);
      }, 1500);

      return;
    }

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      await likePost(postId);
    } catch (error) {
      console.error("Lỗi khi thả tim:", error);
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors hover:bg-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isLiked ? "red" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={isLiked ? "red" : "currentColor"}
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>

      <span className={`font-medium ${isLiked ? "text-red-500" : "text-gray-600"}`}>
        {likeCount}
      </span>
    </button>
  );
}
