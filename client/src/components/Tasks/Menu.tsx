import { useState } from "react";
import { MenuType, Task, TaskStatus } from "../../models/TaskModels";
import closeIcon from "../../assets/close-icon.svg";
import downArrow from "../../assets/arrow-down.svg";

interface MenuProps {
  menuType: MenuType;
  selectedStatus?: string | null;
  onSelectStatus?: (status: TaskStatus | null) => void;
  task?: Task;
  onSetTask?: (value: Task) => void;
  tasksList?: Task[];
  onApplyDateRange?: () => Promise<void>;
}

const Menu = ({
  menuType,
  task,
  onSetTask,
  selectedStatus,
  onSelectStatus,
  onApplyDateRange,
}: MenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleSelectStatus = (status: TaskStatus | null) => {
    onSelectStatus?.(status);
    setIsMenuOpen(false);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = new Date(e.target.value).toISOString(); // Convert to ISO string

    const updatedTask: Task = {
      ...task!,
      startDate,
    };

    onSetTask?.(updatedTask);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = new Date(e.target.value).toISOString(); // Convert to ISO string

    const updatedTask: Task = {
      ...task!,
      endDate,
    };

    onSetTask?.(updatedTask);
  };

  const handleSelectDateRange = () => {
    onApplyDateRange?.();
    setIsMenuOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Toggle Button */}
      <div
        className="flex items-center w-72 rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        onClick={toggleMenu}
      >
        {menuType === MenuType.DATE_RANGE && (
          <div className="flex flex-1">
            <span>{"Select date range"}</span>
          </div>
        )}
        {menuType === MenuType.STATUS && (
          <>
            <div className="flex flex-1">
              <span>{selectedStatus || "Select task status"}</span>
            </div>
            <img
              src={closeIcon}
              alt="close icon"
              width={12}
              onClick={() => {
                handleSelectStatus?.(null), toggleMenu;
              }}
              className="mr-2 cursor-pointer"
            />
          </>
        )}
        <img src={downArrow} alt="arrow" width={12} />
      </div>

      {/* Menu Content */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {menuType === MenuType.STATUS && (
              <div className="py-1">
                <a
                  href="#"
                  className="text-gray-700 block px-4 py-2 text-sm"
                  onClick={() => handleSelectStatus(TaskStatus.NEW)}
                >
                  {TaskStatus.NEW}
                </a>
                <a
                  href="#"
                  className="text-gray-700 block px-4 py-2 text-sm"
                  onClick={() => handleSelectStatus(TaskStatus.IN_PROGRESS)}
                >
                  {TaskStatus.IN_PROGRESS}
                </a>
                <a
                  href="#"
                  className="text-gray-700 block px-4 py-2 text-sm"
                  onClick={() => handleSelectStatus(TaskStatus.DONE)}
                >
                  {TaskStatus.DONE}
                </a>
              </div>
            )}
            {menuType === MenuType.DATE_RANGE && (
              <>
                <div className="px-4 py-2 text-sm">
                  <label className="block mb-2">Start Date</label>
                  <input
                    type="date"
                    value={
                      task?.startDate
                        ? new Date(task.startDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleStartDateChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="px-4 py-2 text-sm">
                  <label className="block mb-2">End Date</label>
                  <input
                    type="date"
                    value={
                      task?.endDate
                        ? new Date(task.endDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleEndDateChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="px-4 py-2 text-sm">
                  <button
                    onClick={handleSelectDateRange}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
