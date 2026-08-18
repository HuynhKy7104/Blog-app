// File: src/app/blog/[slug]/[id]/_components/ViewTracker.tsx
"use client";

import { useEffect, useRef } from "react";
import { incrementPostViewAction } from "@/lib/actions/postActions";

export default function ViewTracker({ postId }: { postId: number }) {
  const hasFetched = useRef(false);

  useEffect(() => {
    // Nếu không có postId hoặc đã chạy hàm này rồi thì bỏ qua (tránh React strict mode chạy 2 lần)
    if (!postId || hasFetched.current) return;

    // 1. Mở "sổ" LocalStorage xem đã lưu danh sách bài viết từng đọc chưa
    // Dùng try-catch để phòng hờ trường hợp trình duyệt chặn LocalStorage
    try {
      const viewedPostsStr = localStorage.getItem("viewedPosts");
      const viewedPosts: number[] = viewedPostsStr ? JSON.parse(viewedPostsStr) : [];

      // 2. Kiểm tra xem người này đã xem bài này chưa
      if (!viewedPosts.includes(postId)) {
        // CHƯA XEM: Gọi Backend tăng view
        incrementPostViewAction(postId);

        // Đánh dấu là đã xem bằng cách thêm ID vào danh sách
        viewedPosts.push(postId);

        // Cất danh sách mới vào lại "sổ"
        localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));

        console.log(`Đã cộng 1 view cho bài ${postId} và lưu vào LocalStorage.`);
      } else {
        console.log(`Bài ${postId} đã được xem trước đó. Không cộng thêm view.`);
      }
    } catch (error) {
      // Nếu LocalStorage bị lỗi (ví dụ duyệt web ẩn danh quá nghiêm ngặt),
      // ta vẫn gọi tăng view như bình thường
      incrementPostViewAction(postId);
    }

    // Đánh dấu component đã chạy xong nhiệm vụ
    hasFetched.current = true;
  }, [postId]);

  return null; // Component tàng hình
}
