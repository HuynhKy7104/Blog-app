import { fetchPosts } from "@/lib/actions/postActions";
import Hero from "../components/hero";
import Posts from "@/components/Posts";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = page ? Number(page) : 1;

  const { posts, totalPosts } = await fetchPosts({
    page: page ? +page : undefined,
  });

  const totalPages = Math.ceil(totalPosts / DEFAULT_PAGE_SIZE);

  return (
    <main>
      <Hero />
      <Posts
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
      ></Posts>
    </main>
  );
}
