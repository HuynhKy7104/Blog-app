import Link from "next/link";
import SignUpForm from "../_components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản mới</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Tham gia cùng chúng tôi để trải nghiệm các tính năng tuyệt vời
        </p>
      </div>

      <SignUpForm />

      <p className="text-center text-sm text-gray-600 mt-6 flex items-center justify-center gap-1">
        Đã có tài khoản?{" "}
        <Link
          href="/auth/signIn"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
}
