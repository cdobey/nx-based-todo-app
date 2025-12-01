import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $details: String) {
    createTodo(title: $title, details: $details) {
      id
      title
      details
      status
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo(
    $id: ID!
    $title: String
    $details: String
    $status: TodoStatus
  ) {
    updateTodo(id: $id, title: $title, details: $details, status: $status) {
      id
      title
      details
      status
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;
