import { Post } from "@/lib/types/modelTypes";
import Image from "next/image";
import Link from "next/link";

type Props = Partial<Post>;

const PostCard = ({ title, slug, thumbnail, content, createdAt }: Props) => {
  return (
    <div className="flex flex-col h-full bg-primary-950/70 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg shadow-primary-950/20 overflow-hidden hover:border-primary-400 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all">
      <div className="relative w-full aspect-video">
        <Image
          src={thumbnail ?? "/no-image.png"}
          alt={title ?? "Bài viết"}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-lg font-bold text-white line-clamp-2">{title}</h3>
        {content && (
          <p className="text-sm text-primary-100/70 mt-2 line-clamp-3">{content}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-3">
          {createdAt && (
            <p className="text-xs text-primary-200/50">
              {new Date(createdAt).toLocaleDateString("vi-VN")}
            </p>
          )}
          {slug && (
            <Link
              href={`/blog/${slug}`}
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
