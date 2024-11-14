import { useEffect, useState } from "react";
import { Task, TaskStatus } from "../../models/TaskModels";
import TaskList from "./TaskList";
import { deleteTask, getTasks } from "../../services/apiService";
import CreateTask from "./CreateTask";
import TaskStatusMenu from "./TaskStatusMenu";
import { getTaskStatus } from "../../utils/getTaskStatus";

const Tasks = () => {
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
    TaskStatus.ALL
  );

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

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      try {
        await deleteTask(taskId);

        const updatedTasks = tasksList.filter((task) => task._id !== taskId);
        setTasksList(updatedTasks);

        alert("Task deleted successfully!");
      } catch (err) {
        console.error("Failed to delete task.", err);
        alert("Failed to delete task.");
      }
    }
  };

  const filteredTasks =
    selectedStatus === TaskStatus.ALL
      ? tasksList
      : tasksList.filter((task) => getTaskStatus(task) === selectedStatus);

  return (
    <div className="flex flex-col items-start justify-start min-h-screen p-10 w-full">
      <div className="p-4 border border-transparent shadow-lg w-1/2 rounded-box">
        <h1 className="font-bold text-2xl mb-4">Tasks</h1>
        <CreateTask
          setTasksList={setTasksList}
          tasksList={tasksList}
          setLoading={setLoading}
        />
        <div className="mt-5">
          <TaskStatusMenu
            onSelectStatus={(status: TaskStatus) => setSelectedStatus(status)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center mt-4">
            <span className="loading loading-dots loading-md mt-2"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error flex items-center justify-center mt-4">
            <p>Error fetching tasks: {error}</p>
          </div>
        ) : tasksList.length ? (
          <TaskList tasksList={filteredTasks} onDeleteTask={handleDeleteTask} />
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
