import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(5, "Tiêu đề bài viết phải có ít nhất 5 ký tự."),
  content: z.string().min(20, "Nội dung bài viết quá ngắn, cần ít nhất 20 ký tự."),
  thumbnail: z
    .string()
    .url("Đường dẫn ảnh thu nhỏ (thumbnail) không hợp lệ.")
    .optional()
    .or(z.literal("")),
  published: z.boolean().optional(),
  tagIds: z.array(z.number()).optional(),
  slug: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .pipe(
      z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug (đường dẫn) chỉ được chứa chữ cái thường, số và dấu gạch ngang (ví dụ: bai-viet-moi).",
        )
        .optional(),
    ),
});

export const UpdatePostSchema = CreatePostSchema.partial();
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
