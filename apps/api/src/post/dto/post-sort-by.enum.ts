import { registerEnumType } from '@nestjs/graphql';

export enum PostSortBy {
  NEWEST = 'NEWEST', // Mới nhất (Ngày tạo)
  OLDEST = 'OLDEST', // Cũ nhất (Ngày tạo)
  RECENTLY_UPDATED = 'RECENTLY_UPDATED', // Mới cập nhật (Ngày cập nhật)
  MOST_LIKES = 'MOST_LIKES', // Nhiều lượt thích nhất
  MOST_VIEWS = 'MOST_VIEWS', // Nhiều lượt xem nhất
}

registerEnumType(PostSortBy, {
  name: 'PostSortBy',
  description: 'Tùy chọn sắp xếp cho danh sách bài viết',
});
