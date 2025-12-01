import { logger } from './logger';
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
      logger.info('Query: todos - fetching all todos');
      const result = await dataSources.todoAPI.getAllTodos();
      logger.info({ count: result.length }, 'Query: todos - completed');
      return result;
    },
    todo: async (
      _parent: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ) => {
      logger.info({ id }, 'Query: todo - fetching by ID');
      const result = await dataSources.todoAPI.getTodoById(id);
      logger.info({ id, found: !!result }, 'Query: todo - completed');
      return result;
    },
  },
  Mutation: {
    createTodo: async (
      _parent: unknown,
      { title, details }: { title: string; details?: string },
      { dataSources }: Context
    ) => {
      logger.info({ title, hasDetails: !!details }, 'Mutation: createTodo - creating new todo');
      const result = await dataSources.todoAPI.createTodo(title, details);
      logger.info({ id: result.id, title }, 'Mutation: createTodo - completed');
      return result;
    },
    updateTodo: async (
      _parent: unknown,
      { id, title, details }: { id: string; title: string; details?: string },
      { dataSources }: Context
    ) => {
      logger.info({ id, title, hasDetails: !!details }, 'Mutation: updateTodo - updating todo');
      const result = await dataSources.todoAPI.updateTodo(id, title, details);
      logger.info({ id, title }, 'Mutation: updateTodo - completed');
      return result;
    },
    deleteTodo: async (
      _parent: unknown,
      { id }: { id: string },
      { dataSources }: Context
    ) => {
      logger.info({ id }, 'Mutation: deleteTodo - deleting todo');
      const result = await dataSources.todoAPI.deleteTodo(id);
      logger.info({ id, success: result }, 'Mutation: deleteTodo - completed');
      return result;
    },
  },
};
