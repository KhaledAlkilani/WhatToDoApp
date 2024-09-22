import { useEffect, useState } from "react";
import { TaskData, Task } from "../types";
import deleteIcon from "../assets/delete-button-svgrepo-com.svg";

const TaskForm: React.FC<{}> = () => {
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

  const deleteTask = (taskId: number) => {
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
    <div className="flex flex-col items-center justify-start min-h-screen p-4 mt-4">
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
      <ul className="mt-6 w-full max-w-lg list-disc list-inside text-left">
        {tasksList.tasksData.map((task) => {
          return (
            <div
              key={task.id}
              className="mb-2 flex flex-row items-center justify-start w-3/4"
            >
              <li className="flex-1">{task.name}</li>
              <button onClick={() => deleteTask(task.id)}>
                <img src={deleteIcon} width={14} alt="" />
              </button>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskForm;
