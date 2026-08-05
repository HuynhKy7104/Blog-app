import { fetchPosts } from "@/lib/actions/postActions";
import Hero from "../components/hero";
import Posts from "@/components/Posts";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;
  const { posts, totalPosts } = await fetchPosts({
    page: page ? +page : undefined,
  });

  return (
    <main>
      <Hero />
      <Posts posts={posts}></Posts>
    </main>
  );
}
