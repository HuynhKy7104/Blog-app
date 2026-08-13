import { BACKEND_URL } from "./constants";

export const fetchGraphQL = async (query: string, variables = {}, headers = {}) => {
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  return result;
};
