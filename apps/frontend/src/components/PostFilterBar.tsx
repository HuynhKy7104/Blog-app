"use client";

type PostFilterBarProps = {
  status: string;
  onChangeStatus: (status: string) => void;
  sortBy: string;
  onChangeSortBy: (sortBy: string) => void;
  startDate: string;
  onChangeStartDate: (date: string) => void;
  endDate: string;
  onChangeEndDate: (date: string) => void;
};

export default function PostFilterBar({
  status,
  onChangeStatus,
  sortBy,
  onChangeSortBy,
  startDate,
  onChangeStartDate,
  endDate,
  onChangeEndDate,
}: PostFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Lọc Trạng thái */}
      <select
        value={status}
        onChange={(e) => onChangeStatus(e.target.value)}
        className="h-10 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm outline-none bg-white"
      >
        <option value="ALL">Tất cả trạng thái</option>
        <option value="PUBLISHED">Đã xuất bản</option>
        <option value="DRAFT">Bản nháp</option>
      </select>

      {/* Sắp xếp */}
      <select
        value={sortBy}
        onChange={(e) => onChangeSortBy(e.target.value)}
        className="h-10 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm outline-none bg-white"
      >
        <option value="NEWEST">Mới nhất</option>
        <option value="OLDEST">Cũ nhất</option>
        <option value="RECENTLY_UPDATED">Mới cập nhật</option>
        <option value="MOST_LIKES">Nhiều lượt thích nhất</option>
      </select>

      {/* GOM NHÓM: Lọc Từ ngày - Đến ngày */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 h-10">
        <span className="text-sm text-gray-600">Từ:</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChangeStartDate(e.target.value)}
          className="bg-transparent text-sm focus:outline-none"
        />
        <span className="text-sm text-gray-400 mx-1">|</span>
        <span className="text-sm text-gray-600">Đến:</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChangeEndDate(e.target.value)}
          className="bg-transparent text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}
