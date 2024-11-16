import { useEffect, useState } from "react";
import { Task, TaskFormMode, TaskStatus } from "../../models/TaskModels";
import TaskList from "./TaskList";
import {
  createTask,
  deleteTask,
  editTask,
  getTasks,
} from "../../services/apiService";
import TaskStatusMenu from "./TaskStatusMenu";
import { getTaskStatus } from "../../utils/getTaskStatus";
import TaskModal from "./TaskModal";

const initialData: Task = {
  _id: "",
  name: "",
  content: "",
  startDate: new Date(),
  endDate: new Date(),
};

const Tasks = () => {
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<TaskFormMode>(TaskFormMode.CREATE);
  const [task, setTask] = useState<Task>(initialData);

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
  }, [isModalOpen]);

  const checkFieldsValidation = () => {
    const isValid = task.name.trim() !== "" || task.content.trim() !== "";

    if (!isValid) {
      return alert("Task name and content cannot be empty!");
    }
  };

  const checkFieldsChange = () => {
    const taskToEdit = tasksList.find((task) => task);

    if (!taskToEdit) return;

    const isChanged =
      task.name.trim() !== taskToEdit.name.trim() ||
      task.content.trim() !== taskToEdit.content.trim() ||
      task.startDate !== taskToEdit.startDate ||
      task.endDate !== taskToEdit.endDate;

    if (isChanged) {
      return alert(`Are you sure you want to update the task: ${task.name}?`);
    }
  };

  const renderNoTasksMessage = () => {
    if (selectedStatus === TaskStatus.NEW) {
      return "No new tasks.";
    } else if (selectedStatus === TaskStatus.IN_PROGRESS) {
      return "No in-progress tasks.";
    } else if (selectedStatus === TaskStatus.DONE) {
      return "No done tasks.";
    } else {
      return "";
    }
  };

  const openModal = (mode: TaskFormMode, taskId?: string) => {
    setFormMode(mode);
    if (mode === TaskFormMode.UPDATE && taskId) {
      const existingTaskToEdit = tasksList.find((task) => task._id === taskId);
      if (existingTaskToEdit) {
        setTask({
          ...existingTaskToEdit,
        });
      }
    } else {
      setTask(initialData);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    checkFieldsValidation();

    setLoading?.(true);
    try {
      const data = await createTask(task);
      setTasksList?.([...(tasksList || []), data]);
      setLoading?.(false);
      setTask(initialData);
      setIsModalOpen(false);
    } catch (err) {
      setLoading?.(false);
      console.error("Failed to create a new task.", err);
    }
  };

  const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    checkFieldsChange(); // Check if the fields are changed

    // Destructure newTask to get properties
    const { _id, name, content, startDate, endDate } = task;

    const existingTaskToEdit = {
      _id,
      name,
      content,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
    };

    setLoading?.(true);

    try {
      const data = await editTask(_id, existingTaskToEdit);
      setTasksList((prev) =>
        prev.map((task) => (task._id === _id ? data : task))
      ); // Update the task in state
      setLoading?.(false);
      setIsModalOpen(false); // Close modal
    } catch (err) {
      setLoading?.(false);
      console.error("Failed to update task.", err);
    }
  };

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
    selectedStatus === null
      ? tasksList
      : tasksList.filter((task) => getTaskStatus(task) === selectedStatus);

  return (
    <div className="flex flex-col items-start min-h-screen p-10 w-full">
      <div className="p-4 border border-transparent shadow-lg w-3/4 rounded-box">
        <div className="flex">
          <h1 className="font-bold text-2xl mb-4 flex-1">Tasks</h1>

          <button
            onClick={() => openModal(TaskFormMode.CREATE)}
            className="btn btn-primary"
          >
            Create Task
          </button>
          {isModalOpen && (
            <TaskModal
              onClose={closeModal}
              onSubmit={
                formMode === TaskFormMode.CREATE
                  ? handleCreateTask
                  : handleEditTask
              }
              mode={formMode}
              newTask={task}
              setNewTask={setTask}
            />
          )}
        </div>
        <div className="mt-5">
          <TaskStatusMenu
            onSelectStatus={(status: TaskStatus | null) =>
              setSelectedStatus(status)
            }
            selectedStatus={selectedStatus}
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
        ) : filteredTasks.length ? (
          <TaskList
            tasksList={filteredTasks}
            onDeleteTask={handleDeleteTask}
            onOpenEditTaskModal={(mode, taskId) => openModal(mode, taskId)}
          />
        ) : (
          <div className="flex items-center justify-center mt-4">
            <p>{renderNoTasksMessage()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
