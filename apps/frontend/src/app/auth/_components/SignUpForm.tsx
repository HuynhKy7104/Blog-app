"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "./SubmitButton";
import { signUpAction } from "@/lib/actions/authActions";
import { useActionState, useEffect } from "react";
import { FormState } from "@/lib/types/formState";
import { useSearchParams, useRouter } from "next/navigation";

const initialState: FormState = {
  success: false,
  message: "",
  errors: {},
};

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (state?.success) {
      const encodedCallback = encodeURIComponent(callbackUrl);

      // Chờ 2 giây (2000 milliseconds) để người dùng đọc thông báo rồi mới chuyển trang
      const timer = setTimeout(() => {
        router.push(`/auth/signIn?callbackUrl=${encodedCallback}`);
      }, 2000);

      // Dọn dẹp bộ đếm giờ nếu component bị hủy
      return () => clearTimeout(timer);
    }
  }, [state?.success, router, callbackUrl]);

  return (
    <form
      action={formAction}
      className="space-y-4"
      noValidate
    >
      {/* Chỉ giữ lại 1 thẻ ẩn để gửi callbackUrl */}
      <input
        type="hidden"
        name="callbackUrl"
        value={callbackUrl}
      />

      {/* Hiển thị thông báo Server */}
      {state?.message && (
        <div
          className={`p-3 rounded-md text-sm font-medium ${state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Họ và tên</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Nguyễn Văn A"
          required
        />
        {state?.errors?.name && (
          <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        {state?.errors?.password && (
          <p className="text-sm text-red-500 mt-1">{state.errors.password[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />
        {state?.errors?.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </div>

      <div className="pt-2">
        <SubmitButton
          className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg disabled:opacity-70"
          pendingText="Đang tạo tài khoản..."
        >
          {state?.success ? "Thành công! Đang chuyển trang..." : "Đăng ký tài khoản"}
        </SubmitButton>
      </div>
    </form>
  );
}
