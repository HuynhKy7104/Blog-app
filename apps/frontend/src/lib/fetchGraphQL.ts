// Tệp: src/lib/fetchGraphQL.ts

import { BACKEND_URL } from "./constants";
import { refreshAccessToken, logoutAction } from "./actions/authActions";

interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
}

export const fetchGraphQL = async (
  query: string,
  variables: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) => {
  const executeFetch = async (currentHeaders: Record<string, string>) => {
    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...currentHeaders,
      },
      body: JSON.stringify({ query, variables }),
    });
    return await response.json();
  };

  let result = await executeFetch(headers);

  const isUnauthenticated = result.errors?.some(
    (err: GraphQLError) =>
      err.extensions?.code === "UNAUTHENTICATED" ||
      err.message === "Unauthorized" ||
      err.message === "UnauthorizedException",
  );

  if (isUnauthenticated) {
    console.log("Token hết hạn! Đang tự động làm mới...");

    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      console.log("Làm mới thành công! Tiếp tục công việc...");
      const newHeaders: Record<string, string> = {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      result = await executeFetch(newHeaders);
    } else {
      console.log("Refresh token hết hạn. Tự động gọi API Đăng xuất...");
      await logoutAction();
    }
  }

  return result;
};
