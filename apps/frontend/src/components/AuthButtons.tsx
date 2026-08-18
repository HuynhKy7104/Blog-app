"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"; // 1. Import thêm useSearchParams

export default function AuthButtons() {
  const pathname = usePathname();
  const searchParams = useSearchParams(); // 2. Lấy các tham số trên thanh địa chỉ (URL query)

  const isAuthPage = pathname.startsWith("/auth");

  const targetUrl = isAuthPage ? searchParams.get("callbackUrl") || "/" : pathname;

  const encodedCallback = encodeURIComponent(targetUrl);

  return (
    <>
      <Link
        href={`/auth/signIn?callbackUrl=${encodedCallback}`}
        className="w-2/3 mx-auto text-center md:text-left md:w-auto border-b border-gray-100 md:border-none px-4 py-3 md:py-2 text-sm md:text-base rounded-md transition hover:bg-primary-600 hover:text-primary-50"
      >
        Đăng nhập
      </Link>
      <Link
        href={`/auth/signUp?callbackUrl=${encodedCallback}`}
        className="w-2/3 mx-auto text-center md:text-left md:w-auto border-b border-gray-100 md:border-none px-4 py-3 md:py-2 text-sm md:text-base rounded-md transition hover:bg-primary-600 hover:text-primary-50"
      >
        Đăng ký
      </Link>
    </>
  );
}
