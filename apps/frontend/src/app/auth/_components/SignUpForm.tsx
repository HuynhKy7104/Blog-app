"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "./SubmitButton";
import { signUpAction } from "@/lib/actions/authActions";
import { useActionState } from "react";
import { FormState } from "@/lib/types/formState";

const initialState: FormState = {
  success: false,
  message: "",
  errors: {},
};

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form
      action={formAction}
      className="space-y-4"
      noValidate
    >
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
          className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-lg"
          pendingText="Đang tạo tài khoản..."
        >
          Đăng ký tài khoản
        </SubmitButton>
      </div>
    </form>
  );
}
