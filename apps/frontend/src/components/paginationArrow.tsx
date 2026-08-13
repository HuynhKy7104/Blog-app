import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href?: string;
  icon?: ReactNode;
  isDisabled: boolean;
  className?: string;
  scroll?: boolean;
  onClick?: () => void;
};

const PaginationArrow = ({
  href,
  icon,
  isDisabled,
  className = "",
  scroll = false,
  onClick,
}: Props) => {
  if (isDisabled) {
    return (
      <div
        className={`flex justify-center items-center rounded-md bg-space text-white border border-primary-600 opacity-50 cursor-not-allowed ${className}`}
      >
        {icon}
      </div>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex justify-center items-center rounded-md bg-space text-white border border-primary-600 hover:bg-primary-600 transition-colors duration-200 ${className}`}
      >
        {icon}
      </button>
    );
  }

  return (
    <Link
      href={href || "#"}
      scroll={scroll}
      className={`flex justify-center items-center rounded-md bg-space text-white border border-primary-600 hover:bg-primary-600 transition-colors duration-200 ${className}`}
    >
      {icon}
    </Link>
  );
};

export default PaginationArrow;
