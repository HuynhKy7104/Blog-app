import gql from "graphql-tag";

export const GET_POSTS = gql`
  query GetPosts($input: GetPostsInput) {
    posts(input: $input) {
      posts {
        id
        title
        slug
        thumbnail
        content
        createdAt
        updatedAt
        published
        views
        likeCount
        commentCount
        author {
          name
        }
        tags {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query findPostById($id: Int!) {
    findPostById(id: $id) {
      id
      slug
      title
      content
      thumbnail
      published
      createdAt
      updatedAt
      likeCount
      isLiked

      author {
        id
        name
        avatar
      }

      tags {
        id
        name
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($signUpInput: SignUpInput!) {
    CreateUser(signUpInput: $signUpInput) {
      id
      name
      email
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput) {
      id
      name
      avatar
      accessToken
      refreshToken
    }
  }
`;

export const GET_POST_COMMENTS = gql`
  query getPostComments($postId: Int!, $take: Int, $skip: Int) {
    getPostComments(postId: $postId, take: $take, skip: $skip) {
      id
      content
      author {
        name
        avatar
      }
      createdAt
    }

    postCommentCount(postId: $postId)
  }
`;

export const CREATE_POST_COMMENT = gql`
  mutation ($content: String!, $postId: Int!) {
    createPostComment(content: $content, postId: $postId) {
      id
    }
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: Int!) {
    likePost(postId: $postId)
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($input: GetUserPostsInput) {
    getUserPosts(input: $input) {
      posts {
        id
        title
        thumbnail
        published
        createdAt
        likeCount
        content
        updatedAt
        views
        tags {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreateUserPost($createData: CreatePostInput!) {
    createUserPost(createData: $createData) {
      id
      title
      content
      thumbnail
      published
      updatedAt
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdateUserPost($postId: Int!, $updateData: UpdatePostInput!) {
    updateUserPost(postId: $postId, updateData: $updateData) {
      id
      title
      content
      thumbnail
      published
      updatedAt
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeleteUserPost($postId: Int!) {
    deleteUserPost(postId: $postId)
  }
`;

export const GET_TAGS = gql`
  query {
    tags {
      id
      name
    }
  }
`;

export const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
`;
