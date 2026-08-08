import Link from "next/link";
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/20/solid";
import { calculatePageNumbers } from "@/lib/helpers";

type Props = {
  totalPages: number;
  currentPage: number;
  pageNeighbors?: number;
  className?: string;
};

const Pagination = ({
  totalPages,
  currentPage,
  pageNeighbors = 2,
  className,
}: Props) => {
  const createPageURL = (pageNumber: number | string) => {
    return `?page=${pageNumber}`;
  };

  const pages = calculatePageNumbers({ totalPages, currentPage, pageNeighbors });

  return (
    <div className="flex flex-row gap-2 justify-center items-center mt-8">
      {currentPage !== 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="w-9 h-9 rounded-md bg-space text-white border border-primary-600 hover:bg-primary-600 transition-colors duration-200"
          aria-label="Trang trước"
        >
          <ChevronDoubleLeftIcon />
        </Link>
      )}

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={index}
              className="w-9 h-9 flex items-center justify-center rounded-md transition-colors duration-200 bg-space text-white"
            >
              ...
            </span>
          );
        }

        const isCurrentPage = page === currentPage;

        return (
          <Link
            key={index}
            href={createPageURL(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors duration-200
              ${
                isCurrentPage
                  ? "bg-primary-600 text-white font-bold"
                  : "bg-space text-white border border-primary-600 hover:bg-primary-600"
              }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage !== totalPages - 1 && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="w-9 h-9 rounded-md bg-space text-white border border-primary-600 hover:bg-primary-600 transition-colors duration-200"
          aria-label="Trang tiếp theo"
        >
          <ChevronDoubleRightIcon />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
