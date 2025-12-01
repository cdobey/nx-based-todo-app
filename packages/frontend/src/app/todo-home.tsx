import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

type TodoFilter = 'all' | 'active' | 'completed';

export default function TodoHome() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTodos((previous) => [...previous, newTodo]);
    setNewTodoTitle('');
  };

  const toggleTodo = (id: string) => {
    setTodos((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((previous) => previous.filter((todo) => todo.id !== id));
  };

  const activeTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos]
  );
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed),
    [todos]
  );

  const filterOptions = useMemo(
    () => [
      { id: 'all' as const, label: 'All Tasks', count: todos.length },
      { id: 'active' as const, label: 'Active', count: activeTodos.length },
      {
        id: 'completed' as const,
        label: 'Done',
        count: completedTodos.length,
      },
    ],
    [activeTodos.length, completedTodos.length, todos.length]
  );

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return activeTodos;
      case 'completed':
        return completedTodos;
      default:
        return todos;
    }
  }, [activeTodos, completedTodos, filter, todos]);

  const emptyStateCopy: Record<
    TodoFilter,
    { title: string; subtitle: string }
  > = {
    all: {
      title: 'No tasks yet',
      subtitle: 'Add your first task to get started',
    },
    active: {
      title: 'All done!',
      subtitle: 'No active tasks right now',
    },
    completed: {
      title: 'Nothing completed',
      subtitle: 'Complete tasks to see them here',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-lg text-gray-600">Simple, focused, and minimal</p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-500">Total</div>
            <div className="text-4xl font-bold text-gray-900">
              {todos.length}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-500">Active</div>
            <div className="text-4xl font-bold text-gray-900">
              {activeTodos.length}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-2 text-sm font-medium text-gray-500">Done</div>
            <div className="text-4xl font-bold text-gray-900">
              {completedTodos.length}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <form onSubmit={addTodo}>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodoTitle}
                onChange={(event) => setNewTodoTitle(event.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Plus className="h-5 w-5" />
                Add
              </button>
            </div>
          </form>
        </div>

        <div className="mb-6 flex gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                filter === option.id
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              <span>{option.label}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-semibold',
                  filter === option.id
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {filteredTodos.length > 0 ? (
          <div className="space-y-3">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Circle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              {emptyStateCopy[filter].title}
            </h3>
            <p className="text-gray-600">{emptyStateCopy[filter].subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const completed = todo.completed;

  return (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-lg border p-4 transition-colors',
        completed
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        className={cn(
          'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors focus:outline-none',
          completed
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-300 bg-white text-gray-400 hover:border-gray-900 hover:text-gray-900'
        )}
        aria-pressed={completed}
      >
        {completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1">
        <p
          className={cn(
            'text-base font-medium text-gray-900',
            completed && 'text-gray-500 line-through'
          )}
        >
          {todo.title}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-400 opacity-0 transition-all hover:bg-gray-900 hover:text-white group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        aria-label="Delete todo"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
