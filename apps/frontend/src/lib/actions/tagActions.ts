"use server";

import { print } from "graphql";
import { GET_TAGS } from "../gqlQueries";
import { fetchGraphQL } from "../fetchGraphQL";

export const fetchAllTags = async () => {
  try {
    const result = await fetchGraphQL(print(GET_TAGS), {});

    if (result.errors) {
      console.error("Lỗi từ GraphQL:", result.errors);
      throw new Error(result.errors[0]?.message || "Lỗi khi lấy danh sách thể loại");
    }

    return result.data.tags;
  } catch (error) {
    console.error("=== LỖI HỆ THỐNG TRONG FETCH ALL TAGS ===", error);
    throw error;
  }
};
