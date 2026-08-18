"use server"; // Khai báo đây là một Server Action chạy trên máy chủ

import { createClient } from "@supabase/supabase-js";

export async function uploadThumbnailAction(formData: FormData) {
  try {
    // 1. Lấy tệp từ FormData
    const image = formData.get("image") as File;
    if (!image) throw new Error("Không tìm thấy tệp ảnh được gửi lên");

    // 2. Sử dụng biến môi trường bảo mật (không cần NEXT_PUBLIC_)
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_API_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Đọc dữ liệu tệp thành ArrayBuffer (cách an toàn nhất để upload từ Server)
    const arrayBuffer = await image.arrayBuffer();

    // 4. Tải lên Supabase
    const data = await supabase.storage
      .from("thumbnail")
      .upload(`${image.name}_${Date.now()}`, arrayBuffer, {
        contentType: image.type, // Báo cho Supabase biết đây là loại ảnh gì (png, jpg,...)
      });

    if (!data.data?.path) throw new Error("Tải ảnh lên Supabase thất bại");

    // 5. Lấy URL công khai
    const urlData = supabase.storage.from("thumbnail").getPublicUrl(data.data.path);

    return urlData.data.publicUrl;
  } catch (error) {
    console.error("Lỗi tại Server Action uploadThumbnailAction:", error);
    throw error;
  }
}
