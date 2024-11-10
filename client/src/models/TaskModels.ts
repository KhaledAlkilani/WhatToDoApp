export interface Task {
  id?: number;
  name: string;
  content: string;
  startDate?: Date;
  endDate?: Date;
}

export interface TaskListProps {
  tasksList: Task[];
  onDeleteTask: (taskId: number) => void;
}
