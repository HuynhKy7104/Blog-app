import { fetchPosts } from "@/lib/actions/postActions";
import Hero from "../components/hero";
import Posts from "@/components/Posts";

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <main>
      <Hero />
      <Posts posts={posts}></Posts>
    </main>
  );
}
