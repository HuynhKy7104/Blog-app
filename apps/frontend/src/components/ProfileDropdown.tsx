"use client";

import Link from "next/link";
import { SessionUser } from "@/lib/sessions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTransition } from "react";
import { logoutAction } from "@/lib/actions/authActions";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "📝 Tạo bài viết mới", href: "/posts/create" },
  { label: "📚 Danh sách bài viết", href: "/posts/my-posts" },
];

type Props = {
  user: SessionUser;
};

export default function ProfileDropdown({ user }: Props) {
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction(pathname);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none transition-transform hover:scale-105">
        <Avatar className="w-10 h-10 border border-gray-200 shadow-sm">
          <AvatarImage
            src={user.avatar || ""}
            alt={user.name || "User Avatar"}
          />
          <AvatarFallback className="bg-primary-600 text-white font-bold text-lg">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 mt-1"
      >
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.href}>
            <Link
              href={item.href}
              className="cursor-pointer w-full text-sm"
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className={`w-full text-left block px-4 py-2 text-sm font-medium transition-colors cursor-pointer
          ${isPending ? "text-gray-400" : "text-red-600 hover:bg-red-50 focus:text-red-700 focus:bg-red-50"}`}
          >
            {isPending ? "⏳ Đang xử lý..." : "🚪 Đăng xuất"}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
