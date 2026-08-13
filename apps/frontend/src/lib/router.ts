/**
 *
 * @param currentPath
 * @returns
 */
export const getLoginUrl = (currentPath: string): string => {
  if (!currentPath) return "/login";

  const encodedCallbackUrl = encodeURIComponent(currentPath);

  return `/auth/signIn?callbackUrl=${encodedCallbackUrl}`;
};
