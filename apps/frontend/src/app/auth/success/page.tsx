"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setupGoogleSessionAction } from "@/lib/actions/authActions";

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const avatar = searchParams.get("avatar");

    const handleSetupSession = async () => {
      if (accessToken && id) {
        const sessionPayload = {
          user: {
            id: Number(id),
            name: name || "Google User",
            avatar: avatar || "",
          },
          accessToken,
          refreshToken,
        };

        await setupGoogleSessionAction(sessionPayload);

        router.push("/");
        router.refresh();
      } else {
        router.push("/auth/signin");
      }
    };

    handleSetupSession();
  }, [searchParams, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
        <p className="text-gray-600 font-medium">
          Đang thiết lập phiên làm việc, vui lòng chờ...
        </p>
      </div>
    </div>
  );
}
