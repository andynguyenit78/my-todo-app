import { DropResult } from 'react-beautiful-dnd';
import { PRIORITIES, CATEGORIES, BACKGROUND_THEMES } from '../constants/board';

export type Priority = typeof PRIORITIES[number];
export type Category = typeof CATEGORIES[number];
export type BackgroundTheme = keyof typeof BACKGROUND_THEMES;
export type ColumnType = 'todo' | 'inProgress' | 'complete' | 'uncomplete' | string;

export interface TodoItem {
  id: string;
  text: string;
  description: string;
  images: string[]; // Array of Base64 encoded images
  status: ColumnType;
  priority?: Priority;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface Column {
  id: ColumnType;
  title: string;
  items: TodoItem[];
  color: string;
}

export type BoardData = Record<ColumnType, Column>;

export type DragResult = DropResult; 