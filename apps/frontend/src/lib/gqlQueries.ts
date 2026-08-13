import gql from "graphql-tag";

export const GET_POSTS = gql`
  query posts($skip: Float!, $take: Float!) {
    posts(skip: $skip, take: $take) {
      id
      title
      thumbnail
      content
      createdAt
      slug
    }

    postCount
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
