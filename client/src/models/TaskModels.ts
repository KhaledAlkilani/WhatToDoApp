export enum TaskStatus {
  NEW = "New",
  IN_PROGRESS = "In-Progress",
  DONE = "Done",
}

export enum TaskFormOnSubmitStatuses {
  FILLINFIELDS = "Fill in fields",
  TASKCREATED = "Task created successfully",
  TASKUPDATED = "Task updated successfully.",
}

export enum TaskFormMode {
  CREATE = "create",
  UPDATE = "edit",
}

export interface Task {
  _id: string;
  name: string;
  content: string;
  startDate?: Date | string;
  endDate?: Date | string;
  status?: TaskStatus;
  category?: string;
}

export interface Category {
  _id: string;
  categories: string[];
}

export enum MenuType {
  STATUS = "Status",
  DATE_RANGE = "Date range",
  TASK_CATEGORY = "Task category",
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}
