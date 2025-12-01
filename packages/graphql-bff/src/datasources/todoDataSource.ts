import axios from 'axios';

export interface Todo {
  id: string;
  title: string;
  details?: string;
  status: 'Todo' | 'InProgress' | 'Completed';
}

export class TodoDataSource {
  private baseURL: string;

  constructor(baseURL?: string) {
    const resolved =
      baseURL || process.env.TODO_BACKEND_URL || process.env.BACKEND_URL;
    if (!resolved) {
      throw new Error(
        'Backend base URL is not configured. Set TODO_BACKEND_URL or BACKEND_URL.'
      );
    }
    this.baseURL = resolved;
  }

  async getAllTodos(): Promise<Todo[]> {
    const response = await axios.get<Todo[]>(`${this.baseURL}/api/todo`);
    return response.data;
  }

  async getTodoById(id: string): Promise<Todo> {
    const response = await axios.get<Todo>(`${this.baseURL}/api/todo/${id}`);
    return response.data;
  }

  async createTodo(title: string, details?: string): Promise<Todo> {
    const response = await axios.post<Todo>(`${this.baseURL}/api/todo`, {
      title,
      details,
    });
    return response.data;
  }

  async updateTodo(id: string, title: string, details?: string): Promise<Todo> {
    const response = await axios.put<Todo>(`${this.baseURL}/api/todo/${id}`, {
      title,
      details,
    });
    return response.data;
  }

  async deleteTodo(id: string): Promise<boolean> {
    await axios.delete(`${this.baseURL}/api/todo/${id}`);
    return true;
  }
}
