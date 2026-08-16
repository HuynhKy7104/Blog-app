"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import {
  GET_POST_BY_ID,
  GET_POSTS,
  GET_USER_POSTS,
  LIKE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from "../gqlQueries";
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

export const fetchUserPosts = async ({
  page,
  pageSize,
  search,
  isPublished,
  sortBy = "NEWEST",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  isPublished?: boolean;
  sortBy?: string;
}) => {
  const session = await getSession();

  const { skip, take } = transformTakeSkip({ page, pageSize });

  const input = {
    skip,
    take,
    search: search || undefined,
    isPublished,
    sortBy,
  };

  const result = await fetchGraphQL(
    print(GET_USER_POSTS),
    { input },
    {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  );

  if (result.errors || !result.data) {
    console.error(
      "=== LỖI TỪ GRAPHQL BACKEND ===",
      JSON.stringify(result.errors, null, 2),
    );

    return { posts: [], totalCount: 0 };
  }

  return {
    posts: result.data.getUserPosts.posts as Post[],
    totalCount: result.data.getUserPosts.totalCount as number,
  };
};

export const updateUserPost = async (
  postId: number,
  updateData: {
    title?: string;
    content?: string;
    thumbnail?: string;
    published?: boolean;
  },
) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Bạn chưa đăng nhập!");
  }

  const result = await fetchGraphQL(
    print(UPDATE_POST_MUTATION),
    {
      postId,
      updateData,
    },
    {
      Authorization: `Bearer ${session.accessToken}`,
    },
  );

  if (result.errors || !result.data) {
    console.error(
      "=== LỖI CẬP NHẬT BÀI VIẾT ===",
      JSON.stringify(result.errors, null, 2),
    );

    const originalError = result.errors[0]?.extensions?.originalError;

    if (originalError && Array.isArray(originalError.message)) {
      throw new Error(originalError.message[0]);
    }

    throw new Error(
      result.errors[0]?.message ||
        "Không thể cập nhật bài viết lúc này. Vui lòng kiểm tra lại.",
    );
  }

  return result.data.updateUserPost;
};
