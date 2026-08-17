import { fetchPosts } from "@/lib/actions/postActions";
import Hero from "../components/hero";
import Posts from "@/components/Posts";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import HomeFilterBar from "@/components/filter/HomeFilterBar";
import { fetchAllTags } from "@/lib/actions/tagActions";
import { fetchAllAuthors } from "@/lib/actions/userActions";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  const page = resolvedParams.page;
  const search = resolvedParams.search;
  const sortBy = resolvedParams.sortBy;
  const tagId = resolvedParams.tagId;
  const authorId = resolvedParams.authorId;

  const currentPage = page ? Number(page) : 1;
  const searchQuery = search ? String(search) : undefined;
  const sortOption = sortBy ? String(sortBy) : undefined;
  const parsedAuthorId = authorId ? Number(authorId) : undefined;
  const parsedTagIds = tagId ? [Number(tagId)] : undefined;

  // 1. Chạy TẤT CẢ các API cùng một lúc bằng Promise.all để tối ưu tốc độ
  const [postData, tags, authors] = await Promise.all([
    fetchPosts({
      page: currentPage,
      search: searchQuery,
      sortBy: sortOption,
      authorId: parsedAuthorId,
      tagIds: parsedTagIds,
      status: "PUBLISHED",
    }),
    fetchAllTags(), // Mở comment này sau khi bạn đã có hàm
    fetchAllAuthors(), // Mở comment này sau khi bạn đã có hàm
  ]);

  const { posts, totalCount } = postData;
  const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE);

  return (
    <main>
      <Hero />
      <section className="container m-8 max-w-5xl mx-auto">
        {/* 2. Truyền danh sách thật vào FilterBar */}
        <HomeFilterBar
          tags={tags || []}
          authors={authors || []}
        />
      </section>
      <Posts
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </main>
  );
}
