export enum TaskStatus {
  NEW = "New",
  IN_PROGRESS = "In-Progress",
  DONE = "Done",
}

export enum TaskFormOnSubmitStatuses {
  FILLINFIELDS = "Fill in fiels",
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
}
