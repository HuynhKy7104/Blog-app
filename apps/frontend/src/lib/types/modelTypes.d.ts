export type Post = {
  id: number;
  title: string;
  slug: string;
  author: User;
  content: string;
  thumbnail: string | null;
  published: boolean;
  authorId: number;
  tags?: Tag[];
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  commentCount;
  isLiked: boolean;
  views: number;
  _count: {
    likes: number;
    comments: number;
  };
};

export type User = {
  name: string;
  id: number;
  email: string;
  bio: string | null;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: number;
  name: string;
};

export type CommentEntity = {
  id: number;
  content: string;
  post: Post;
  author: User;
  createdAt: Date;
  updatedAt: Date;
};

// export type PostInputData = {
//   title?: string;
//   content?: string;
//   thumbnail?: string;
//   published?: boolean;
//   tagIds?: number[];
// };

export type FetchPostsParams = {
  page: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  tagIds?: number[];
  authorId?: number;
};
