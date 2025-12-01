import { TodoDataSource } from './datasources/todoDataSource';

interface Context {
  dataSources: {
    todoAPI: TodoDataSource;
  };
}

export const resolvers = {
  Query: {
    todos: async (
      _parent: unknown,
      _args: unknown,
      { dataSources }: Context
    ) => {
      return dataSources.todoAPI.getAllTodos();
    },
    todo: async (
      _parent: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ) => {
      return dataSources.todoAPI.getTodoById(id);
    },
  },
  Mutation: {
    createTodo: async (
      _parent: unknown,
      { title, details }: { title: string; details?: string },
      { dataSources }: Context
    ) => {
      return dataSources.todoAPI.createTodo(title, details);
    },
    updateTodo: async (
      _parent: unknown,
      { id, title, details }: { id: string; title: string; details?: string },
      { dataSources }: Context
    ) => {
      return dataSources.todoAPI.updateTodo(id, title, details);
    },
    deleteTodo: async (
      _parent: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ) => {
      return dataSources.todoAPI.deleteTodo(id);
    },
  },
};
