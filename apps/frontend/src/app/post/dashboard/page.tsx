import { Metadata } from "next";
import UserPostsClient from "./_components/UserPostsClient";

// Tối ưu hóa SEO: Khai báo metadata cho trang tại Server Component
export const metadata: Metadata = {
  title: "Quản lý bài viết cá nhân",
  description: "Bảng điều khiển quản lý các bài viết trên blog của bạn.",
};

export default function UserPostsManagementPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <UserPostsClient />
    </div>
  );
}
