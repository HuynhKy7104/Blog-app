// Hàm tiện ích tạo slug từ tiếng Việt
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Tách các dấu thanh ra khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu thanh
    .replace(/đ/g, 'd') // Xử lý riêng chữ đ
    .replace(/[^a-z0-9 -]/g, '') // Chỉ giữ lại chữ, số, khoảng trắng và gạch ngang
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng gạch ngang
    .replace(/-+/g, '-') // Gộp nhiều gạch ngang liên tiếp thành 1
    .replace(/^-+|-+$/g, ''); // Xóa gạch ngang ở đầu và cuối chuỗi
}
