"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import { GET_POST_BY_ID, GET_POSTS, LIKE_POST_MUTATION } from "../gqlQueries";
import { Post } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";
import { getSession } from "../sessions";

export const fetchPosts = async ({
  page,
  pageSize,
}: {
  page?: number;
  pageSize?: number;
}) => {
  const { skip, take } = transformTakeSkip({ page, pageSize });

  const result = await fetchGraphQL(print(GET_POSTS), { skip, take });
  return { posts: result.data.posts as Post[], totalPosts: result.data.postCount };
};

export const fetchPostById = async (id: number) => {
  const session = await getSession();

  const result = await fetchGraphQL(
    print(GET_POST_BY_ID),
    { id },
    {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  );
  return result.data.findPostById as Post;
};

export const likePost = async (postId: number) => {
  const session = await getSession();
  const result = await fetchGraphQL(
    print(LIKE_POST_MUTATION),
    { postId },
    {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  );
  return result.data;
};
