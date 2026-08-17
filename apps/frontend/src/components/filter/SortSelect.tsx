// components/common/SortSelect.tsx
"use client";

type SortSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm outline-none bg-white cursor-pointer hover:border-gray-400 transition-colors"
    >
      <option value="NEWEST">Mới nhất</option>
      <option value="OLDEST">Cũ nhất</option>
      <option value="RECENTLY_UPDATED">Mới cập nhật</option>
      <option value="MOST_LIKES">Nhiều lượt thích nhất</option>
      <option value="MOST_VIEWS">Phổ biến nhất (Lượt xem)</option>
    </select>
  );
}
