"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../fetchGraphQL";
import { GET_USERS } from "../gqlQueries";

export const fetchAllAuthors = async () => {
  try {
    const result = await fetchGraphQL(print(GET_USERS), {});

    if (result.errors) {
      console.error("Lỗi từ GraphQL:", result.errors);
      throw new Error(result.errors[0]?.message || "Lỗi khi lấy danh sách tác giả");
    }

    return result.data.users;
  } catch (error) {
    console.error("=== LỖI HỆ THỐNG TRONG FETCH ALL USERS ===", error);
    throw error;
  }
};
