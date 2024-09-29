import { useEffect, useState } from "react";
import { TaskData, Task } from "../types";
import TaskList from "./TaskList";

const Tasks: React.FC<{}> = () => {
  const [tasksList, setTasksList] = useState<TaskData>({
    newTask: "",
    tasksData: [],
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasksData");

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      if (Array.isArray(parsedTasks)) {
        setTasksList({ newTask: "", tasksData: parsedTasks });
      } else {
        setTasksList({ newTask: "", tasksData: [] });
      }
    }
  }, []);

  useEffect(() => {
    if (tasksList.tasksData.length > 0) {
      localStorage.setItem("tasksData", JSON.stringify(tasksList.tasksData));
    }
  }, [tasksList.tasksData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTasksList({
      ...tasksList,
      newTask: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tasksList.newTask.trim() === "")
      return alert("Task name cannot be empty!");

    const newTask: Task = {
      id: tasksList.tasksData.length + 1,
      name: tasksList.newTask,
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

      localStorage.setItem("tasksData", JSON.stringify(updatedTasks));
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-center gap-4 w-full max-w-lg"
      >
        <input
          type="text"
          placeholder="New task"
          value={tasksList.newTask}
          onChange={handleInputChange}
          className="input input-bordered w-full md:flex-1"
        />
        <button type="submit" className="btn btn-primary w-full md:w-auto">
          Add new task
        </button>
      </form>

      <TaskList tasksList={tasksList} onDeleteTask={handleDeleteTask} />
    </div>
  );
};

export default Tasks;
