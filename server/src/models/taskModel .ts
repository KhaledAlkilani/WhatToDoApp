import mongoose, { Schema, Document } from "mongoose";

export enum TaskStatus {
  NEW = "New",
  IN_PROGRESS = "In-Progress",
  DONE = "Done",
}

// Task document
interface Task extends Document {
  name: string;
  content: string;
  startDate?: Date;
  endDate?: Date;
  status: TaskStatus;
  category: mongoose.Types.ObjectId;
}

// Task schema
const taskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: [TaskStatus.NEW, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
      default: TaskStatus.NEW,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Tasks",
  }
);

// Task model from the schema
const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;
