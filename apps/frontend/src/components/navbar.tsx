import Link from "next/link";

type Props = {};

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const Navbar = (props: Props) => {
  return (
    <>
      <h1 className="text-2xl font-bold p-2">Blog Hiện Đại Của Tôi</h1>
      <div
        className="flex flex-col md:flex-row gap-2 ml-auto 
      [&>a]:px-4 [&>a]:py-2 [&>a]:rounded-md [&>a]:transition 
      [&>a]:hover:bg-primary-600 [&>a]:hover:text-primary-50"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
