import { registerEnumType } from '@nestjs/graphql';

export enum PostSortBy {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

registerEnumType(PostSortBy, {
  name: 'PostSortBy',
  description: 'Sort order for user posts',
});
