"use server";

import { FormState } from "../types/formState";
import { SignInSchema, SignUpSchema } from "../schemas/auth.schema";
import { fetchGraphQL } from "../fetchGraphQL";
import { CREATE_USER_MUTATION, SIGN_IN } from "../gqlQueries";
import { print } from "graphql";
import { createSession, deleteSession } from "../sessions";
import { redirect } from "next/navigation";

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

    return { success: true, message: "Đăng ký thành công!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Đăng ký thất bại, vui lòng thử lại.",
    };
  }
};

export async function logoutAction() {
  await deleteSession();
}

export async function setupGoogleSessionAction(payload: any) {
  await createSession(payload);
}
