"use server";

import { FormState } from "../types/formState";
import { SignInSchema, SignUpSchema } from "../schemas/auth.schema";
import { fetchGraphQL } from "../fetchGraphQL";
import {
  CREATE_USER_MUTATION,
  LOGOUT_MUTATION,
  REFRESH_TOKEN_MUTATION,
  SIGN_IN,
} from "../gqlQueries";
import { print } from "graphql";
import {
  createSession,
  deleteSession,
  getSession,
  SessionPayload,
} from "../sessions";
import { redirect } from "next/navigation";
import { BACKEND_URL } from "../constants";

export const signInAction = async (
  _prevData: FormState,
  formData: FormData,
): Promise<FormState> => {
  let isLoginSuccess = false;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const validatedFields = SignInSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin đăng nhập.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email: validEmail, password: validPassword } = validatedFields.data;

  try {
    const result = await fetchGraphQL(print(SIGN_IN), {
      signInInput: {
        email: validEmail,
        password: validPassword,
      },
    });

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0].message;

      return {
        success: false,
        message: "Đăng nhập thất bại.",
        errors: {
          email: [errorMessage],
        },
      };
    }

    const { id, name, avatar, accessToken, refreshToken } = result.data.signIn;

    await createSession({
      user: {
        id,
        name,
        avatar,
      },
      accessToken,
      refreshToken,
    });

    isLoginSuccess = true;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại, vui lòng thử lại.",
    };
  }

  if (isLoginSuccess) {
    redirect(callbackUrl);
  }

  return _prevData;
};

export const signUpAction = async (
  _prevData: FormState,
  formData: FormData,
): Promise<FormState> => {
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  const callbackUrl = formData.get("callbackUrl")?.toString() || "/";

  const validatedFields = SignUpSchema.safeParse({
    email,
    name,
    password,
    confirmPassword,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Vui lòng kiểm tra lại thông tin đã nhập.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    name: validName,
    email: validEmail,
    password: validPassword,
  } = validatedFields.data;

  try {
    const result = await fetchGraphQL(print(CREATE_USER_MUTATION), {
      signUpInput: { email: validEmail, name: validName, password: validPassword },
    });

    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors[0].message;
      return {
        success: false,
        message: "Đăng ký thất bại.",
        errors: {
          email: [errorMessage],
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau.",
      errors: {},
    };
  }

  const encodedCallback = encodeURIComponent(callbackUrl);
  redirect(`/auth/signIn?callbackUrl=${encodedCallback}`);
};

export const logoutAction = async (callbackUrl: string = "/") => {
  try {
    const session = await getSession();

    if (session && session.user.id) {
      await fetch(`${BACKEND_URL}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: LOGOUT_MUTATION,
          variables: { userId: session.user.id },
        }),
      });
    }
  } catch (error) {
    console.error("Lỗi khi gọi API đăng xuất:", error);
  } finally {
    await deleteSession(callbackUrl);
  }
};

export async function setupGoogleSessionAction(payload: SessionPayload) {
  await createSession(payload);
}

export const refreshAccessToken = async () => {
  try {
    const session = await getSession();

    if (!session || !session.refreshToken) {
      return null;
    }

    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: print(REFRESH_TOKEN_MUTATION),
        variables: { token: session.refreshToken },
      }),
    });

    const result = await response.json();

    if (result.errors || !result.data?.refreshToken) {
      return null;
    }

    const { accessToken, refreshToken } = result.data.refreshToken;

    const updatedPayload = {
      ...session,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    await createSession(updatedPayload);

    return accessToken;
  } catch (error) {
    console.error("=== LỖI KHI LÀM MỚI TOKEN TỪ SESSION ===", error);
    return null;
  }
};
