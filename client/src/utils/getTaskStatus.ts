import { Task, TaskStatus } from "../models/TaskModels";

export const getTaskStatus = (task: Task) => {
  const currentDate = new Date();

  if (task.startDate && new Date(task.startDate) > currentDate) {
    return TaskStatus.NEW;
  } else if (task.endDate && new Date(task.endDate) < currentDate) {
    return TaskStatus.DONE;
  } else {
    return TaskStatus.IN_PROGRESS;
  }
};
