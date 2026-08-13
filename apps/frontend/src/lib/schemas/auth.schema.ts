import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự." })
      .max(50, { message: "Tên không được vượt quá 50 ký tự." }),

    email: z.string().email({ message: "Vui lòng nhập một địa chỉ email hợp lệ." }),

    password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z.string().email({ message: "Vui lòng nhập một địa chỉ email hợp lệ." }),

  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
});
