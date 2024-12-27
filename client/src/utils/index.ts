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

export const formatDateForInput = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "";

  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }

  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return "";
  }
};