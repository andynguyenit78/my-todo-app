import { TodoItem } from './todo';

export interface Column {
  id: string;
  title: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  todos: TodoItem[];
}

export interface BoardTheme {
  id: string;
  name: string;
  backgroundImage: string;
  darkMode: boolean;
}

export interface BoardState {
  columns: Record<string, Column>;
  backgroundTheme: BoardTheme;
  customColumns: Column[];
} 