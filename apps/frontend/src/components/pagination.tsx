"use client";

import Link from "next/link";
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/20/solid";
import { calculatePageNumbers } from "@/lib/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PaginationArrow from "./paginationArrow";
import { useTransition } from "react";

type Props = {
  totalPages: number;
  currentPage: number;
  pageNeighbors?: number;
  className?: string;
  onPageChange?: (page: number) => void;
};

const Pagination = ({
  totalPages,
  currentPage,
  pageNeighbors = 2,
  className,
  onPageChange,
}: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const pages = calculatePageNumbers({ totalPages, currentPage, pageNeighbors });

  const createPageURL = (page: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathName}?${params.toString()}`;
  };

  const handleMobileNavigation = (formData: FormData) => {
    const pageNumber = parseInt(formData.get("page") as string, 10);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      if (onPageChange) {
        onPageChange(pageNumber);
      } else {
        startTransition(() => {
          router.replace(createPageURL(pageNumber), { scroll: false });
        });
      }
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 justify-center items-center mt-8 ${className || ""}`}
    >
      {/* 1. GIAO DIỆN DESKTOP */}
      <div className="hidden md:flex flex-row gap-2">
        <PaginationArrow
          href={onPageChange ? undefined : createPageURL(currentPage - 1)}
          onClick={onPageChange ? () => onPageChange(currentPage - 1) : undefined}
          icon={<ChevronDoubleLeftIcon className="w-5 h-5" />}
          isDisabled={currentPage === 1}
          className="w-9 h-9"
        />

        {pages.map((page, index) => {
          if (page === "...")
            return (
              <span
                key={index}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-space text-white"
              >
                ...
              </span>
            );

          const isCurrentPage = page === currentPage;
          const commonClass = `w-9 h-9 flex items-center justify-center rounded-md transition-colors duration-200 ${isCurrentPage ? "bg-primary-600 text-white font-bold" : "bg-space text-white border border-primary-600 hover:bg-primary-600"}`;

          if (onPageChange) {
            return (
              <button
                key={index}
                onClick={() => onPageChange(page as number)}
                className={commonClass}
              >
                {page}
              </button>
            );
          }

          return (
            <Link
              key={index}
              scroll={false}
              href={createPageURL(page)}
              className={commonClass}
            >
              {page}
            </Link>
          );
        })}

        <PaginationArrow
          href={onPageChange ? undefined : createPageURL(currentPage + 1)}
          onClick={onPageChange ? () => onPageChange(currentPage + 1) : undefined}
          icon={<ChevronDoubleRightIcon className="w-5 h-5" />}
          isDisabled={currentPage === totalPages}
          className="w-9 h-9"
        />
      </div>

      {/* 2. GIAO DIỆN MOBILE */}
      <div className="flex md:hidden items-center gap-2 w-full max-w-62.5">
        <PaginationArrow
          href={onPageChange ? undefined : createPageURL(currentPage - 1)}
          onClick={onPageChange ? () => onPageChange(currentPage - 1) : undefined}
          icon={<ChevronDoubleLeftIcon className="w-5 h-5" />}
          isDisabled={currentPage === 1}
          className="w-10 h-10"
        />

        <form
          action={handleMobileNavigation}
          className="flex-1"
        >
          <input
            key={currentPage}
            name="page"
            type="number"
            min={1}
            max={totalPages}
            disabled={isPending}
            placeholder={`${currentPage} / ${totalPages}`}
            aria-label="Đi đến trang"
            className={`w-full text-center py-2 bg-space text-white border border-primary-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-400 ${isPending ? "opacity-50" : ""}`}
          />
        </form>

        <PaginationArrow
          href={onPageChange ? undefined : createPageURL(currentPage + 1)}
          onClick={onPageChange ? () => onPageChange(currentPage + 1) : undefined}
          icon={<ChevronDoubleRightIcon className="w-5 h-5" />}
          isDisabled={currentPage === totalPages}
          className="w-10 h-10"
        />
      </div>
    </div>
  );
};

export default Pagination;
