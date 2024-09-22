export enum NavButtons {
  About = "About",
  Works = "Works",
  Skills = "Skills",
  Contact = "Contact",
}

export interface Task {
  id: number;
  name: string;
}

export interface TaskData {
  newTask: string;
  tasksData: Task[];
}
