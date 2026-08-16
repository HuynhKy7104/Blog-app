import Image from "next/image";
import { fetchPostById } from "@/lib/actions/postActions";
import DOMPurify from "isomorphic-dompurify";
import CommentSection from "./_components/comments";
import { getSession } from "@/lib/sessions";
import Likes from "./_components/likes";
import { Tag } from "@/lib/types/modelTypes";

type PostPageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function PostDetailPage({ params }: PostPageProps) {
  const session = await getSession();

  const isLoggedIn = !!session;
  const currentUser = session
    ? {
        name: session.user.name,
        avatar: session.user.avatar,
      }
    : undefined;

  const resolvedParams = await params;

  const postId = parseInt(resolvedParams.id, 10);
  const post = await fetchPostById(postId);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space text-white">
        <h1 className="text-2xl">Không tìm thấy bài viết!</h1>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <article className="relative max-w-3xl mx-auto pt-32 pb-12 px-4 sm:px-6">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-950 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600">
            {post.author?.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                width={48}
                height={48}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                👤
              </div>
            )}

            <div>
              <p className="text-primary-900 font-bold text-lg">
                {post.author?.name || "Ẩn danh"}
              </p>
              <p className="text-sm text-gray-500">
                Đăng ngày: {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </header>

        {post.thumbnail && (
          <div className="relative w-full h-75 sm:h-112.5 mb-12 rounded-2xl overflow-hidden shadow-md border border-gray-100">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div
          className="prose max-w-none text-gray-800 text-lg leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-2 items-center">
            <span className="text-gray-500 mr-2 font-medium">Chủ đề:</span>
            {post.tags.map((tag: Tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full border border-primary-100 font-medium"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <Likes
          postId={post.id}
          initialLikeCount={post.likeCount}
          initialIsLiked={post.isLiked}
          isLoggedIn={isLoggedIn}
        />

        <CommentSection
          postId={postId}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
        />
      </article>
    </main>
  );
}
