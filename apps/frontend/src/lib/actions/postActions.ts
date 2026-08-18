"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import {
  CREATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POSTS,
  GET_USER_POSTS,
  LIKE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from "../gqlQueries";
import { Post, PostInputData } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";
import { getSession } from "../sessions";
import { DEFAULT_PAGE_SIZE, DEFAULT_POSTS_SIZE } from "../constants";

// 1. TẠO KIỂU DỮ LIỆU CHUNG
export type FetchPostsParams = {
  page: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  tagIds?: number[];
  authorId?: number;
};

// 2. HÀM TIỆN ÍCH DÙNG CHUNG: Lắp ráp biến input cho GraphQL
const buildPostQueryInput = (params: FetchPostsParams) => {
  const { page, pageSize, search, status, sortBy, startDate, endDate, tagIds } =
    params;

  // Tính toán phân trang
  const { skip, take } = transformTakeSkip({ page, pageSize });

  // Xử lý trạng thái xuất bản
  let isPublished = undefined;
  if (status === "PUBLISHED") isPublished = true;
  if (status === "DRAFT") isPublished = false;

  // Trả về object input hoàn chỉnh
  return {
    skip,
    take,
    ...(search && { search }),
    ...(isPublished !== undefined && { isPublished }),
    ...(sortBy && { sortBy }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(tagIds && tagIds.length > 0 && { tagIds }),
    ...(params.authorId && { authorId: params.authorId }),
  };
};

export const fetchPosts = async (params: FetchPostsParams) => {
  const input = buildPostQueryInput(params);
  const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;

  const result = await fetchGraphQL(print(GET_POSTS), { input });

  if (result.errors || !result.data) {
    console.error(
      "=== LỖI TỪ GRAPHQL BACKEND (getPosts) ===",
      JSON.stringify(result.errors, null, 2),
    );
    return { posts: [], totalCount: 0, currentPage: params.page, totalPages: 0 };
  }

  const totalCount = result.data.posts.totalCount as number;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    posts: result.data.posts.posts as Post[],
    totalCount,
    currentPage: params.page,
    totalPages,
  };
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

export const fetchUserPosts = async (params: FetchPostsParams) => {
  const session = await getSession();

  const input = buildPostQueryInput(params);
  const pageSize = params.pageSize || DEFAULT_POSTS_SIZE;

  const result = await fetchGraphQL(
    print(GET_USER_POSTS),
    { input },
    { Authorization: `Bearer ${session?.accessToken}` },
  );

  if (result.errors || !result.data) {
    console.error(
      "=== LỖI TỪ GRAPHQL BACKEND (getUserPosts) ===",
      JSON.stringify(result.errors, null, 2),
    );
    return { posts: [], totalCount: 0, currentPage: params.page, totalPages: 0 };
  }

  const totalCount = result.data.getUserPosts.totalCount as number;
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    posts: result.data.getUserPosts.posts as Post[],
    totalCount,
    currentPage: params.page,
    totalPages,
  };
};

export const createUserPost = async (createData: PostInputData) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Bạn chưa đăng nhập!");
  }

  const result = await fetchGraphQL(
    print(CREATE_POST_MUTATION),
    {
      createData,
    },
    {
      Authorization: `Bearer ${session.accessToken}`,
    },
  );

  if (result.errors || !result.data) {
    console.error(
      "=== LỖI TẠO BÀI VIẾT ===",
      JSON.stringify(result.errors, null, 2),
    );

    const originalError = result.errors[0]?.extensions?.originalError;
    if (originalError && Array.isArray(originalError.message)) {
      throw new Error(originalError.message[0]);
    }

    throw new Error(
      result.errors[0]?.message ||
        "Không thể tạo bài viết lúc này. Vui lòng kiểm tra lại.",
    );
  }

  return result.data.createUserPost;
};

export const updateUserPost = async (postId: number, updateData: PostInputData) => {
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
