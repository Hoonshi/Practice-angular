export interface Todo {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  priority: 'urgent' | 'normal' | 'low';
  isCompleted: boolean;
  completedAt: string | null;
}
