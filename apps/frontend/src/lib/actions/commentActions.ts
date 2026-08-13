"use server";

import { fetchGraphQL } from "../fetchGraphQL";
import { GET_POST_COMMENTS } from "../gqlQueries";
import { transformTakeSkip } from "../helpers";
import { print } from "graphql";
import { CommentEntity } from "../types/modelTypes";

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
