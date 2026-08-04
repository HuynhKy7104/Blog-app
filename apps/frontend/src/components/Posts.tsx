import { Post } from "@/lib/types/modelTypes";
import PostCard from "@/components/postCard";

type Props = {
  posts: Post[];
};

const Posts = (props: Props) => {
  return (
    <section className="container m-8 max-w-5xl mx-auto">
      <h2 className="text-5xl font-bold text-center text-primary-900 leading-tight ">
        Bài Viết Mới
      </h2>

      <div
        className="h-1 mx-auto bg-linear-to-r from-primary-600 to-secondary-600 w-96 
      mb-9 rounded-t-md mt-5"
      ></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {props.posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
          />
        ))}
      </div>
    </section>
  );
};

export default Posts;
