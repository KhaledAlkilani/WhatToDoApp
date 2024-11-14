export enum TaskStatus {
  NEW = "New",
  IN_PROGRESS = "In-Progress",
  DONE = "Done",
  ALL = "All",
}

export interface Task {
  _id: string;
  name: string;
  content: string;
  startDate?: Date;
  endDate?: Date;
  status?: TaskStatus;
}
