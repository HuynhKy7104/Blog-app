"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import { GET_POST_BY_ID, GET_POSTS } from "../gqlQueries";
import { Post } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";

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
  const result = await fetchGraphQL(print(GET_POST_BY_ID), { id });
  return result.data.findPostById as Post;
};
