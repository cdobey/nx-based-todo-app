import axios from 'axios';
import { logger } from '../logger';

export interface Todo {
  id: string;
  title: string;
  details?: string;
  status: 'Todo' | 'InProgress' | 'Completed';
}

export class TodoDataSource {
  private baseURL: string;

  constructor(baseURL?: string) {
    const resolved = baseURL || process.env.BACKEND_URL;
    if (!resolved) {
      throw new Error('Backend base URL is not configured. Set BACKEND_URL.');
    }
    this.baseURL = resolved;
  }

  async getAllTodos(): Promise<Todo[]> {
    logger.debug({ url: `${this.baseURL}/api/todo` }, 'DataSource: GET all todos');
    try {
      const response = await axios.get<Todo[]>(`${this.baseURL}/api/todo`);
      // Filter out invalid todos with null/empty titles
      const validTodos = response.data.filter(todo => {
        if (!todo.title) {
          logger.warn({ todo }, 'DataSource: Skipping todo with null/empty title');
          return false;
        }
        return true;
      });
      logger.debug({ 
        totalCount: response.data.length, 
        validCount: validTodos.length,
        status: response.status 
      }, 'DataSource: GET all todos - success');
      return validTodos;
    } catch (error) {
      logger.error({ error, url: `${this.baseURL}/api/todo` }, 'DataSource: GET all todos - failed');
      throw error;
    }
  }

  async getTodoById(id: string): Promise<Todo> {
    logger.debug({ id, url: `${this.baseURL}/api/todo/${id}` }, 'DataSource: GET todo by ID');
    try {
      const response = await axios.get<Todo>(`${this.baseURL}/api/todo/${id}`);
      if (!response.data.title) {
        logger.error({ id, todo: response.data }, 'DataSource: Todo has null/empty title');
        throw new Error(`Todo with id ${id} has invalid title`);
      }
      logger.debug({ id, status: response.status }, 'DataSource: GET todo by ID - success');
      return response.data;
    } catch (error) {
      logger.error({ error, id, url: `${this.baseURL}/api/todo/${id}` }, 'DataSource: GET todo by ID - failed');
      throw error;
    }
  }

  async createTodo(title: string, details?: string): Promise<Todo> {
    logger.debug({ title, hasDetails: !!details, url: `${this.baseURL}/api/todo` }, 'DataSource: POST create todo');
    try {
      const response = await axios.post<Todo>(`${this.baseURL}/api/todo`, {
        title,
        details,
      });
      logger.debug({ id: response.data.id, title, status: response.status }, 'DataSource: POST create todo - success');
      return response.data;
    } catch (error) {
      logger.error({ error, title, url: `${this.baseURL}/api/todo` }, 'DataSource: POST create todo - failed');
      throw error;
    }
  }

  async updateTodo(id: string, title: string, details?: string): Promise<Todo> {
    logger.debug({ id, title, hasDetails: !!details, url: `${this.baseURL}/api/todo/${id}` }, 'DataSource: PUT update todo');
    try {
      const response = await axios.put<Todo>(`${this.baseURL}/api/todo/${id}`, {
        title,
        details,
      });
      logger.debug({ id, title, status: response.status }, 'DataSource: PUT update todo - success');
      return response.data;
    } catch (error) {
      logger.error({ error, id, url: `${this.baseURL}/api/todo/${id}` }, 'DataSource: PUT update todo - failed');
      throw error;
    }
  }

  async deleteTodo(id: string): Promise<boolean> {
    logger.debug({ id, url: `${this.baseURL}/api/todo/${id}` }, 'DataSource: DELETE todo');
    try {
      await axios.delete(`${this.baseURL}/api/todo/${id}`);
      logger.debug({ id }, 'DataSource: DELETE todo - success');
      return true;
    } catch (error) {
      logger.error({ error, id, url: `${this.baseURL}/api/todo/${id}` }, 'DataSource: DELETE todo - failed');
      throw error;
    }
  }
}
