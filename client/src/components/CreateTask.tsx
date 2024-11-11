import { useState } from "react";
import arrowDown from "../assets/arrow-down.svg";
import { Task } from "../models/TaskModels";

interface CreateTaskProps {
  newTask: Task;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CreateTask = ({
  newTask,
  onNameChange,
  onContentChange,
  onStartDateChange,
  onEndDateChange,
  onFormSubmit,
}: CreateTaskProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle create task accordion open/close
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={toggleAccordion}
        className="flex items-center cursor-pointer p-4 bg-gray-100 rounded-lg shadow-sm"
      >
        <h2 className="text-xl font-semibold flex-1">Create a New Task</h2>
        <img
          src={arrowDown}
          alt="Toggle arrow"
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Accordion Body (Form) */}
      {isOpen && (
        <form
          onSubmit={onFormSubmit}
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
              onChange={onNameChange}
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
              onChange={onContentChange}
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
              onChange={onStartDateChange}
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
              onChange={onEndDateChange}
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
