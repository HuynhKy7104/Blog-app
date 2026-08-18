// Không còn "use client" ở đây nữa! Trang này là Server Component.

import CreatePostClient from "./_components/CreatePostClient";

export default function CreatePostPage() {
  return (
    <div className="container max-w-3xl mx-auto py-10 px-4 mt-20">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* Phần khung giao diện tĩnh này sẽ được render ngay lập tức từ Server */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Viết bài mới</h1>
        <p className="text-gray-500 mb-8">
          Chia sẻ kiến thức và suy nghĩ của bạn với mọi người.
        </p>

        {/* Nhúng phần tương tác (Client Component) vào đây */}
        <CreatePostClient />
      </div>
    </div>
  );
}
