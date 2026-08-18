"use server";

import { FormState } from "../types/formState";
import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import {
  CREATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POSTS,
  GET_USER_POSTS,
  INCREMENT_POST_VIEW_MUTATION,
  LIKE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from "../gqlQueries";
import { FetchPostsParams, Post } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";
import { getSession } from "../sessions";
import { DEFAULT_PAGE_SIZE, DEFAULT_POSTS_SIZE } from "../constants";
import { CreatePostSchema, UpdatePostSchema } from "../schemas/post.schemas";

const extractPostFormData = (formData: FormData) => {
  return {
    title: formData.get("title")?.toString() || "",
    content: formData.get("content")?.toString() || "",
    thumbnail: formData.get("thumbnail")?.toString() || "",
    published: formData.get("published") === "on",
    slug: formData.get("slug")?.toString() || "",
    tagIds: formData.getAll("tagIds").map((id) => Number(id)),
  };
};

const buildPostQueryInput = (params: FetchPostsParams) => {
  const { page, pageSize, search, status, sortBy, startDate, endDate, tagIds } =
    params;

  const { skip, take } = transformTakeSkip({ page, pageSize });

  let isPublished = undefined;
  if (status === "PUBLISHED") isPublished = true;
  if (status === "DRAFT") isPublished = false;

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

export const createPostAction = async (
  _prevData: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawData = extractPostFormData(formData);

  const validatedFields = CreatePostSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin bài viết.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await getSession();
  if (!session?.accessToken) {
    return { success: false, message: "Bạn chưa đăng nhập!", errors: {} };
  }

  try {
    const result = await fetchGraphQL(
      print(CREATE_POST_MUTATION),
      {
        createData: validatedFields.data,
      },
      {
        Authorization: `Bearer ${session.accessToken}`,
      },
    );

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0]?.message || "Lỗi từ máy chủ.";
      return { success: false, message: errorMessage, errors: {} };
    }

    return {
      success: true,
      message: "Tạo bài viết thành công!",
      errors: {},
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra.",
      errors: {},
    };
  }
};

export const updatePostAction = async (
  _prevData: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawPostId = formData.get("postId")?.toString();
  const postId = rawPostId ? parseInt(rawPostId, 10) : 0;

  if (!postId) {
    return { success: false, message: "Không tìm thấy ID bài viết.", errors: {} };
  }

  const rawData = extractPostFormData(formData);

  const validatedFields = UpdatePostSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin bài viết.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await getSession();
  if (!session?.accessToken) {
    return { success: false, message: "Bạn chưa đăng nhập!", errors: {} };
  }

  try {
    const result = await fetchGraphQL(
      print(UPDATE_POST_MUTATION),
      {
        postId,
        updateData: validatedFields.data,
      },
      {
        Authorization: `Bearer ${session.accessToken}`,
      },
    );

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0]?.message || "Lỗi từ máy chủ.";
      return { success: false, message: errorMessage, errors: {} };
    }

    return { success: true, message: "Cập nhật bài viết thành công!", errors: {} };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra.",
      errors: {},
    };
  }
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

export async function incrementPostViewAction(postId: number) {
  try {
    await fetchGraphQL(INCREMENT_POST_VIEW_MUTATION, { postId });

    return { success: true };
  } catch (error) {
    console.error("Lỗi khi đếm lượt xem:", error);
    return { success: false };
  }
}
