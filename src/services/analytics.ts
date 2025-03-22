import { logger } from '../utils/logger';
import { TodoItem, BoardData } from '../types/todo';

interface TodoMetrics {
  totalTodos: number;
  completedTodos: number;
  completionRate: number;
  averageTimeToComplete: number;
  todosByPriority: Record<string, number>;
  todosByCategory: Record<string, number>;
}

class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  trackEvent(eventName: string, data: any) {
    logger.info('Analytics event', { eventName, data });
    // Here you would typically send to an analytics service
    // Example: mixpanel.track(eventName, data);
  }

  calculateTodoMetrics(columns: BoardData): TodoMetrics {
    const allTodos = Object.values(columns).flatMap(column => column.items);
    const completedTodos = allTodos.filter(todo => todo.status === 'complete');
    
    const completionTimes = completedTodos
      .filter(todo => todo.createdAt && todo.updatedAt)
      .map(todo => {
        const created = new Date(todo.createdAt!).getTime();
        const updated = new Date(todo.updatedAt!).getTime();
        return updated - created;
      });

    const averageTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;

    const todosByPriority = allTodos.reduce((acc, todo) => {
      if (todo.priority) {
        acc[todo.priority] = (acc[todo.priority] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const todosByCategory = allTodos.reduce((acc, todo) => {
      if (todo.category) {
        acc[todo.category] = (acc[todo.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTodos: allTodos.length,
      completedTodos: completedTodos.length,
      completionRate: allTodos.length > 0 
        ? (completedTodos.length / allTodos.length) * 100 
        : 0,
      averageTimeToComplete: averageTime,
      todosByPriority,
      todosByCategory
    };
  }

  trackTodoCreated(todo: TodoItem) {
    this.trackEvent('todo_created', {
      todoId: todo.id,
      category: todo.category,
      priority: todo.priority,
      hasDescription: Boolean(todo.description),
      hasImages: todo.images.length > 0
    });
  }

  trackTodoUpdated(oldTodo: TodoItem, newTodo: TodoItem) {
    this.trackEvent('todo_updated', {
      todoId: newTodo.id,
      changes: {
        textChanged: oldTodo.text !== newTodo.text,
        descriptionChanged: oldTodo.description !== newTodo.description,
        statusChanged: oldTodo.status !== newTodo.status,
        imagesChanged: oldTodo.images.length !== newTodo.images.length
      }
    });
  }

  trackTodoDeleted(todo: TodoItem) {
    if (!todo.createdAt) return;
    
    this.trackEvent('todo_deleted', {
      todoId: todo.id,
      status: todo.status,
      lifetime: new Date().getTime() - new Date(todo.createdAt).getTime()
    });
  }

  trackTodoMoved(todoId: string, fromColumn: string, toColumn: string) {
    this.trackEvent('todo_moved', {
      todoId,
      from: fromColumn,
      to: toColumn,
      timestamp: new Date().toISOString()
    });
  }

  trackUserSession() {
    this.trackEvent('session_started', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }
}

export const analytics = AnalyticsService.getInstance(); 