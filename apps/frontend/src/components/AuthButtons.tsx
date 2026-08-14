"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthButtons() {
  const pathname = usePathname();

  const encodedCallback = encodeURIComponent(pathname);

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
