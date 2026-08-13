"use server";

import { fetchGraphQL } from "../fetchGraphQL";
import { CREATE_POST_COMMENT, GET_POST_COMMENTS } from "../gqlQueries";
import { transformTakeSkip } from "../helpers";
import { print } from "graphql";
import { CommentEntity } from "../types/modelTypes";
import { getSession } from "../sessions";

export const getPostComments = async ({
  postId,
  page,
  pageSize,
}: {
  postId: number;
  page?: number;
  pageSize?: number;
}) => {
  const { take, skip } = transformTakeSkip({ page, pageSize });

  const result = await fetchGraphQL(print(GET_POST_COMMENTS), {
    postId,
    take,
    skip,
  });

  return {
    comments: result.data.getPostComments as CommentEntity[],
    count: result.data.postCommentCount,
  };
};

export const createCommentAction = async ({
  postId,
  content,
}: {
  postId: number;
  content: string;
}) => {
  const session = await getSession();

  const accessToken = session?.accessToken;

  const result = await fetchGraphQL(
    print(CREATE_POST_COMMENT),
    { postId, content },
    { Authorization: `Bearer ${accessToken}` },
  );

  if (!result || !result.data) {
    const errorMessage =
      result?.errors?.[0]?.message || "Có lỗi xảy ra khi gọi máy chủ GraphQL";

    throw new Error(errorMessage);
  }

  return result.data.createPostComment;
};
