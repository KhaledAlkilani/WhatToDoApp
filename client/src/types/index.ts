export interface NavButtonData {
  id: string;
  title: string;
}

export const navButtons = [
  { id: "dashboard", to: "/", title: "Dashboard" },
  { id: "tasks", to: "/tasks", title: "Tasks" },
];

export interface NavButtonProps {
  button: NavButtonData;
  focusedBorderBottom: boolean;
}

export interface Task {
  id: number;
  name: string;
}

export interface TaskData {
  newTask?: string;
  tasksData: Task[];
}

export interface TaskListProps {
  tasksList: TaskData;
  onDeleteTask: (taskId: number) => void;
}
