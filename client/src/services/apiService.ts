import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Task } from "../models/TaskModels";
import { Category } from "../models/CategoryModel";

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
    throw new Error(`Error fetching tasks. ${err.response?.data}`);
  }
}

export async function createTask(task: Task) {
  try {
    const newTask = {
      name: task.name,
      content: task.content,
      startDate: task.startDate,
      endDate: task.endDate,
      categoryName: task.category?.categoryName,
    };

    console.log("Payload sent to backend:", newTask);

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
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(err);
    throw new Error(`Error creating a task. ${err.response?.data}`);
  }
}

export async function editTask(
  taskId: string,
  updatedTaskData: {
    name: string;
    content: string;
    startDate: Date;
    endDate: Date;
    categoryName: string;
  }
) {
  try {
    const response: AxiosResponse = await apiClient.put(
      `/tasks/${taskId}`,
      updatedTaskData
    );

    // Return the response data (updated task).
    return response.data;
  } catch (error) {
    const err = error as AxiosError;

    throw new Error(
      `Failed to edit a task. ${err.response?.data || err.message}`
    );
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    const response: AxiosResponse = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(`Failed to delete a task. ${err.response?.data}`);
  }
}

export const searchTasksByName = async (name: string) => {
  try {
    const response: AxiosResponse = await apiClient.get(
      "/tasks/search-tasks-by-name",
      {
        params: { name },
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error searching tasks by name:", err.message);
    throw new Error("Error searching tasks by name");
  }
};

export const getTasksByDateRange = async (
  startDate: string,
  endDate: string
) => {
  try {
    const response: AxiosResponse = await apiClient.get("/tasks/date-range", {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error filtering tasks by date range:", err.message);
    throw new Error("Error filtering tasks by date range.");
  }
};

export const getTasksWithPagination = async (currentPage: number) => {
  try {
    const response: AxiosResponse = await apiClient.get("/tasks/pagination", {
      params: { page: currentPage },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error fetching tasks with pagination:", err.message);
    throw new Error("Error fetching tasks with pagination.");
  }
};

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response: AxiosResponse<Category[]> = await apiClient.get(
      "/categories"
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(
      `Failed to fetch categories: ${err.response?.data || err.message}`
    );
  }
}
