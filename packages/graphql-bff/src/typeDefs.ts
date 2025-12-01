export const typeDefs = `#graphql
  enum TodoStatus {
    Todo
    InProgress
    Completed
  }

  type Todo {
    id: ID!
    title: String!
    details: String
    status: TodoStatus!
  }

  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
  }

  type Mutation {
    createTodo(title: String!, details: String): Todo!
    updateTodo(id: ID!, title: String, details: String, status: TodoStatus): Todo!
    deleteTodo(id: ID!): Boolean!
  }
`;
