import { getSession } from "@/lib/sessions";
import Link from "next/link";
import AuthButtons from "../AuthButtons";
import ProfileDropdown from "./ProfileDropdown";
import { Suspense } from "react";

type Props = {};

const publicLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

// const authLinks = [
//   { label: "Đăng nhập ", href: "/auth/signIn" },
//   { label: "Đăng ký", href: "/auth/signUp" },
// ];

const Navbar = async (props: Props) => {
  const session = await getSession();

  return (
    <div className="flex flex-col md:flex-row items-center w-full h-full pt-4 md:pt-0">
      <h1 className="text-base md:text-2xl font-bold p-2 text-center md:text-left mb-6 md:mb-0">
        Blog Hiện Đại Của Tôi
      </h1>

      <hr className="w-[80%] border-t border-gray-300 md:hidden mb-4" />

      <div
        className="flex flex-col md:flex-row gap-2 md:gap-4 md:ml-auto w-full md:w-auto px-2 md:px-0
        [&>a]:px-2 [&>a]:py-2 md:[&>a]:px-4 [&>a]:rounded-md [&>a]:transition 
        [&>a]:hover:bg-primary-600 [&>a]:hover:text-primary-50 [&>a]:text-center md:[&>a]:text-left
        [&>a]:text-sm md:[&>a]:text-base"
      >
        {publicLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="w-2/3 mx-auto text-center md:text-left md:w-auto border-b border-gray-100 md:border-none px-4 py-3 md:py-2"
          >
            {link.label}
          </Link>
        ))}

        {!session?.user ? (
          <Suspense fallback={null}>
            <AuthButtons />
          </Suspense>
        ) : (
          <div className="w-full flex justify-center mt-6 md:w-auto md:block md:mt-0">
            <ProfileDropdown user={session.user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
