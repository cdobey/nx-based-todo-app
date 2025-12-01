export enum TodoStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Completed = 'Completed',
}

export interface Todo {
  id: string;
  title: string;
  details?: string;
  status: TodoStatus;
}
