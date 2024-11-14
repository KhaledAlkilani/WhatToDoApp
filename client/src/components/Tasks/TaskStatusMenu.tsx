import { useState } from "react";
import { TaskStatus } from "../../models/TaskModels";

interface TaskStatusMenuProps {
  onSelectStatus: (status: TaskStatus) => void;
}

const TaskStatusMenu = ({ onSelectStatus }: TaskStatusMenuProps) => {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(
    TaskStatus.ALL
  );

  const toggleTaskStatusMenu = () => {
    setIsStatusMenuOpen((prevState) => !prevState);
  };

  const selectTaskStatus = (option: TaskStatus) => {
    setSelectedStatus(option);
    onSelectStatus(option);
    setIsStatusMenuOpen(false);
  };

  return (
    <div className="relative inline-block w-full">
      <h1 className="text-lg mb-1 ml-1 font-bold">Status</h1>
      <button
        type="button"
        className="inline-flex justify-between w-full rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        onClick={toggleTaskStatusMenu}
      >
        <span>{selectedStatus}</span>
        <svg
          className="ml-2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isStatusMenuOpen && (
        <div className="absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm"
              onClick={() => selectTaskStatus(TaskStatus.ALL)}
            >
              {TaskStatus.ALL}
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm"
              onClick={() => selectTaskStatus(TaskStatus.NEW)}
            >
              {TaskStatus.NEW}
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm"
              onClick={() => selectTaskStatus(TaskStatus.IN_PROGRESS)}
            >
              {TaskStatus.IN_PROGRESS}
            </a>
            <a
              href="#"
              className="text-gray-700 block px-4 py-2 text-sm"
              onClick={() => selectTaskStatus(TaskStatus.DONE)}
            >
              {TaskStatus.DONE}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStatusMenu;
