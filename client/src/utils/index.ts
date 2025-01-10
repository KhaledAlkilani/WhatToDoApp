import { Task, TaskStatus } from "../models/TaskModels";

export const getTaskStatus = (task: Task) => {
  return task.status || TaskStatus.NEW;
};

export const formatDateForInput = (
  date: Date | string | null | undefined,
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
