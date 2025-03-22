import { TodoItem } from '../types/todo';
import { Column } from '../types/board';

export const getTotalTodos = (columns: Record<string, Column>): number => {
  return Object.values(columns).reduce((total, column) => total + column.todos.length, 0);
};

export const getCompletionRate = (columns: Record<string, Column>): number => {
  const completedTodos = columns.complete?.todos.length || 0;
  const totalTodos = getTotalTodos(columns);
  return totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
};

export const getAverageTimeToComplete = (columns: Record<string, Column>): number => {
  const completedTodos = columns.complete?.todos || [];
  if (completedTodos.length === 0) return 0;

  const totalTime = completedTodos.reduce((sum, todo) => {
    const completedAt = todo.completedAt ? new Date(todo.completedAt).getTime() : Date.now();
    const createdAt = new Date(todo.createdAt).getTime();
    return sum + (completedAt - createdAt);
  }, 0);

  return totalTime / completedTodos.length / (1000 * 60 * 60); // Convert to hours
}; 