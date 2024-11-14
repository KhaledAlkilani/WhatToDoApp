import { useState } from "react";
import arrowDown from "../assets/arrow-down.svg";
import { Task } from "../../models/TaskModels";
import { createTask } from "../../services/apiService";

interface CreateTaskProps {
  setTasksList: React.Dispatch<React.SetStateAction<Task[]>>;
  tasksList: Task[];
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateTask = ({
  setTasksList,
  tasksList,
  setLoading,
}: CreateTaskProps) => {
  const [newTask, setNewTask] = useState<Task>({
    _id: "",
    name: "",
    content: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);

  const toggleCreateTaskFormAccordion = () => {
    setIsCreateTaskFormOpen(!isCreateTaskFormOpen);
  };

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

  const checkFieldsValidation = () => {
    const isValid = newTask.name.trim() !== "" || newTask.content.trim() !== "";

    if (!isValid) {
      return alert("Task name and content cannot be empty!");
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    checkFieldsValidation();

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

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={toggleCreateTaskFormAccordion}
        className="flex items-center cursor-pointer p-4 bg-gray-100 rounded-lg shadow-sm"
      >
        <h2 className="text-xl font-semibold flex-1">Create a New Task</h2>
        <img
          src={arrowDown}
          alt="Toggle arrow"
          className={`w-5 h-5 transition-transform duration-300 ${
            isCreateTaskFormOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isCreateTaskFormOpen && (
        <form
          onSubmit={handleCreateTask}
          className="flex flex-col gap-6 w-full bg-white p-6 border-b-2 border-blue-200"
        >
          <div>
            <label
              htmlFor="taskName"
              className="block text-sm font-semibold mb-2"
            >
              Task Name
            </label>
            <input
              type="text"
              id="taskName"
              placeholder="New task"
              value={newTask.name || ""}
              onChange={handleTaskNameChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label
              htmlFor="taskContent"
              className="block text-sm font-semibold mb-2"
            >
              Task Content
            </label>
            <input
              type="text"
              id="taskContent"
              placeholder="Task description"
              value={newTask.content || ""}
              onChange={handleTaskContentChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold mb-2"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={newTask.startDate?.toISOString().slice(0, 10) || ""}
              onChange={handleTaskStartDateChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-semibold mb-2"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={newTask.endDate?.toISOString().slice(0, 10) || ""}
              onChange={handleTaskEndDateChange}
              className="input input-bordered w-full"
            />
          </div>

          <button type="submit" className="btn btn-success w-full mt-4">
            <span className="text-white">Add New Task</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateTask;
