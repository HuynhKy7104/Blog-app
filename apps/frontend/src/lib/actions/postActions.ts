"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import {
  DELETE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POSTS,
  GET_USER_POSTS,
  LIKE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from "../gqlQueries";
import { Post } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";
import { getSession } from "../sessions";
import { DEFAULT_POSTS_SIZE } from "../constants";

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
  pageSize = DEFAULT_POSTS_SIZE,
  search,
  status,
  sortBy,
  startDate,
  endDate,
}: {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const session = await getSession();

  const { skip, take } = transformTakeSkip({ page, pageSize });

  let isPublished = undefined;
  if (status === "PUBLISHED") isPublished = true;
  if (status === "DRAFT") isPublished = false;

  const input = {
    skip,
    take,
    ...(search && { search: search }),
    ...(isPublished !== undefined && { isPublished }),
    ...(sortBy && { sortBy: sortBy }), // ví dụ: 'NEWEST', 'MOST_LIKES'
    ...(startDate && { startDate: startDate }), // Chuỗi ISO Date
    ...(endDate && { endDate: endDate }), // Chuỗi ISO Date
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
    tagIds?: number[];
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

export const deleteUserPost = async (postId: number) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Bạn chưa đăng nhập!");
  }

  const result = await fetchGraphQL(
    print(DELETE_POST_MUTATION),
    { postId },
    {
      Authorization: `Bearer ${session.accessToken}`,
    },
  );

  if (result.errors) {
    console.error(
      "=== LỖI XÓA BÀI VIẾT ===",
      JSON.stringify(result.errors, null, 2),
    );
    throw new Error(result.errors[0]?.message || "Không thể xóa bài viết lúc này.");
  }

  return true;
};
