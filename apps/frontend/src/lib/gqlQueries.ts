import gql from "graphql-tag";

export const GET_POSTS = gql`
  query posts($skip: Float, $take: Float) {
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
