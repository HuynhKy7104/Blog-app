import { Suspense } from "react";
import Link from "next/link";
import SignInForm from "../_components/SignInForm";

export default function SignInPage() {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Chào mừng trở lại</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Vui lòng đăng nhập vào tài khoản của bạn
        </p>
      </div>

      <Suspense fallback={<div>Đang tải...</div>}>
        <SignInForm />
      </Suspense>

      <p className="text-center text-sm text-gray-600 mt-6 flex items-center justify-center gap-1">
        Chưa có tài khoản?{" "}
        <Link
          href="/auth/signUp"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
