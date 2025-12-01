import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      details
      status
    }
  }
`;

export const GET_TODO = gql`
  query GetTodo($id: ID!) {
    todo(id: $id) {
      id
      title
      details
      status
    }
  }
`;
