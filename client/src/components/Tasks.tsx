import { useEffect, useState } from "react";
import { Task } from "../models/TaskModels";
import TaskList from "./TaskList";
import { createTask, getTasks } from "../services/apiService";
import CreateTask from "./CreateTask";

const Tasks = () => {
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    name: "",
    content: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // const isValid = newTask.name?.trim() === "" return alert("Task name cannot be empty!");

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then((data) => {
        setTasksList(data);
        setLoading(false);
      })

      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
      ...newTask,
      name: e.target.value,
    });
  };

  const handleTaskContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
      ...newTask,
      content: e.target.value,
    });
  };

  const handleTaskStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTask({
      ...newTask,
      startDate: new Date(e.target.value),
    });
  };

  const handleTaskEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
      ...newTask,
      endDate: new Date(e.target.value),
    });
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const data = await createTask(newTask);
      setTasksList([...tasksList, data]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Failed to create a new task.", err);
    }
  };

  const handleDeleteTask = (taskId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      const updatedTasks = tasksList.filter((task) => task.id !== taskId);

      setTasksList(updatedTasks);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen p-10 w-full">
      <div className="p-4 border border-transparent shadow-lg w-1/2 rounded-box">
        <h1 className="font-bold text-2xl mb-4">Tasks</h1>
        <CreateTask
          newTask={newTask}
          onNameChange={handleTaskNameChange}
          onContentChange={handleTaskContentChange}
          onStartDateChange={handleTaskStartDateChange}
          onEndDateChange={handleTaskEndDateChange}
          onFormSubmit={handleCreateTask}
        />

        {loading ? (
          <div className="flex items-center justify-center mt-4">
            <span className="loading loading-dots loading-md mt-2"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error flex items-center justify-center mt-4">
            <p>Error fetching tasks: {error}</p>
          </div>
        ) : tasksList.length > 0 ? (
          <TaskList tasksList={tasksList} onDeleteTask={handleDeleteTask} />
        ) : (
          <div className="flex items-center justify-center mt-4">
            <p>No tasks available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
