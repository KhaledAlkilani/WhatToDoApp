import mongoose, { Schema, Document } from "mongoose";

// Task document
interface Task extends Document {
  name: string;
  content: string;
  startDate?: Date;
  endDate?: Date;
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
  },
  {
    timestamps: true,
    collection: "Tasks",
  }
);

// Task model from the schema
const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;
