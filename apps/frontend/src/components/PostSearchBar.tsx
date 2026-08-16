"use client";

type PostSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function PostSearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
}: PostSearchBarProps) {
  return (
    <div className="relative w-full sm:w-64 shrink-0">
      {/* Ô nhập liệu - Chốt chiều cao h-[40px] */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm"
      />
      {/* Icon kính lúp */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
