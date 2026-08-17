import { Post } from "@/lib/types/modelTypes";
import Image from "next/image";
import Link from "next/link";

type Props = Partial<Post>;

const PostCard = ({
  title,
  slug,
  thumbnail,
  content,
  createdAt,
  id,
  author,
  tags,
  likeCount = 0,
  commentCount = 0,
  views = 0, // Đặt giá trị mặc định là 0 nếu chưa có lượt xem
}: Props) => {
  return (
    <div className="flex flex-col h-full bg-primary-950/70 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg shadow-primary-950/20 overflow-hidden hover:border-primary-400 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all">
      {/* Kéo Thể loại (Tags) lên đè góc trên của hình ảnh */}
      <div className="relative w-full aspect-video">
        <Image
          src={thumbnail ?? "/no-image.png"}
          alt={title ?? "Bài viết"}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {tags && tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md rounded-md"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        {/* Tiêu đề */}
        <h3 className="text-lg font-bold text-white line-clamp-2">{title}</h3>

        {/* Tác giả & Ngày tháng */}
        <div className="flex items-center gap-2 mt-2 text-xs text-primary-200/60">
          <span className="font-medium text-primary-100">
            {author?.name ?? "Ẩn danh"}
          </span>
          <span>•</span>
          <span>
            {createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : ""}
          </span>
        </div>

        {/* Đoạn trích nội dung */}
        {content && (
          <p className="text-sm text-primary-100/70 mt-3 line-clamp-3">{content}</p>
        )}

        {/* Dòng dưới cùng: Tương tác và Nút Đọc thêm */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs text-primary-200/60">
            {/* 1. Lượt xem  */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{views}</span>
            </div>

            {/* 2. Lượt thích */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{likeCount}</span>
            </div>

            {/* 3. Lượt bình luận */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{commentCount}</span>
            </div>
          </div>

          {slug && (
            <Link
              href={`/blog/${slug}/${id}`}
              className="text-xs font-semibold text-tertiary-400 hover:text-tertiary-300 transition-colors"
            >
              Đọc thêm →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
