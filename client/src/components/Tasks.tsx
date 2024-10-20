import { useEffect, useState } from "react";
import { TaskData, Task } from "../types";
import TaskList from "./TaskList";
import { getTasks } from "../services/apiService";

const Tasks: React.FC<{}> = () => {
  const [tasksList, setTasksList] = useState<TaskData>({
    newTask: "",
    tasksData: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(tasksList.tasksData);

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then((data) => {
        setTasksList({
          tasksData: data.tasks,
        });
        setLoading(false);
      })

      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTasksList({
      ...tasksList,
      newTask: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tasksList.newTask?.trim() === "")
      return alert("Task name cannot be empty!");

    const newTask: Task = {
      id: tasksList.tasksData.length + 1,
      name: tasksList.newTask || "UNKNOWN",
    };

    setTasksList({
      newTask: "",
      tasksData: [...tasksList.tasksData, newTask],
    });
  };

  const handleDeleteTask = (taskId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      const updatedTasks = tasksList.tasksData.filter(
        (task) => task.id !== taskId
      );

      setTasksList({
        ...tasksList,
        tasksData: updatedTasks,
      });
    }
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen p-10 w-full">
      <div className="p-4 border border-transparent shadow-lg w-1/2 rounded-box">
        <h1 className="font-bold text-2xl mb-4">Tasks</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 w-full max-w-lg"
        >
          <input
            type="text"
            placeholder="New task"
            value={tasksList.newTask}
            onChange={handleInputChange}
            className="input input-bordered w-full md:flex-1"
          />
          <button type="submit" className="btn btn-success md:w-auto">
            <span className="text-white">Add new task</span>
          </button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center mt-4">
            <span className="loading loading-dots loading-md mt-2"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error flex items-center justify-center mt-4">
            <p>Error fetching tasks: {error}</p>
          </div>
        ) : tasksList.tasksData.length > 0 ? (
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
