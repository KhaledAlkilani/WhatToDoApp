import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from "axios";
import { Task } from "../models/TaskModels";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
});

export async function getTasks() {
  try {
    const response: AxiosResponse = await apiClient.get("/tasks");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error fetching tasks message: ${err.response?.data}`);
  }
}

export async function createTask(task: Task) {
  try {
    const newTask: Task = {
      name: task.name,
      content: task.content,
      startDate: task.startDate,
      endDate: task.endDate,
    };

    const config: AxiosRequestConfig = {
      headers: {
        Accept: "application/json",
      },
    };

    const response: AxiosResponse = await apiClient.post(
      "/tasks",
      newTask,
      config
    );
    console.log(response.status); // Check response status
    return response.data; // return the data directly from the response
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Error creating a task message: ${err.response?.data}`);
  }
}
