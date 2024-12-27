import { useState } from "react";
import { MenuType, Task, TaskStatus } from "../../models/TaskModels";
import closeIcon from "../../assets/close-icon.svg";
import downArrow from "../../assets/arrow-down.svg";
import { Category } from "../../models/CategoryModel";

interface MenuProps {
  menuType: MenuType;
  selectedStatus?: string;
  task?: Task;
  selectedCategory?: Category;
  categories?: Category[];
  styles?: string;
  onSelectStatus?: (status: TaskStatus | null) => void;
  onSetTask?: (value: Task) => void;
  onApplyDateRange?: () => Promise<void>;
  onCategorySelect?: (category: Category) => void;
  onCategoryChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFetchPagedTasks?: (page: number) => Promise<void>;
}

const Menu = ({
  menuType,
  selectedStatus,
  task,
  selectedCategory,
  categories,
  styles = "",
  onCategorySelect,
  onCategoryChange,
  onSetTask,
  onSelectStatus,
  onApplyDateRange,
  onFetchPagedTasks,
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
  };

  const handleResetDateRange = async () => {
    const resetTask: Task = {
      ...task!,
      startDate: Date(),
      endDate: Date(),
    };
    onSetTask?.(resetTask);
    await onFetchPagedTasks?.(1);
  };

  const handleCategoryClick = (category: Category) => {
    onCategorySelect?.(category);
    setIsMenuOpen(false);
  };

  // Retrieve the typed value from the selectedCategory (if any), and normalize it by trimming spaces and converting to lowercase
  const typedValue = (task?.category?.categoryName ?? "").trim().toLowerCase();

  // Start with the full list of categories (or an empty array if categories are not provided)
  let displayedCategories = categories || [];

  // Check if the user has typed anything in the input field (non-empty typedValue)
  if (typedValue.length > 0) {
    // 1) Filter the categories by the user's typed input (matching category names)
    displayedCategories = displayedCategories.filter(
      (cat) => cat.categoryName.toLowerCase().includes(typedValue) // Check if categoryName contains the typed input (case-insensitive)
    );

    // 2) Exclude the selected category from the list to prevent it from showing again after selection
    if (selectedCategory?._id) {
      displayedCategories = (categories || []).filter(
        (cat) => cat._id !== selectedCategory._id // Exclude the category with the same ID as the selectedCategory
      );
    }
  }

  return (
    <div className={`relative inline-block ${styles}`}>
      {/* Toggle Button */}
      <div
        className={`flex items-center ${styles} rounded-md border border-black bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100`}
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
                handleSelectStatus?.(null);
              }}
              className="mr-2 cursor-pointer"
            />
          </>
        )}

        {menuType === MenuType.TASK_CATEGORY && (
          <>
            <div className="flex flex-1">
              <span
                className={
                  selectedCategory?.categoryName
                    ? "text-black-900"
                    : "text-gray-500"
                }
              >
                {(!isMenuOpen && selectedCategory?.categoryName) ||
                  "Add new or select existing"}
              </span>
            </div>
            <img
              src={closeIcon}
              alt="close icon"
              width={12}
              onClick={() => {
                onCategorySelect?.({ _id: "", categoryName: "" });
              }}
              className="mr-2 cursor-pointer"
            />
          </>
        )}

        <img
          src={downArrow}
          alt="arrow"
          width={12}
          style={{
            transition: "transform 0.3s ease",
            transform: isMenuOpen ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
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
                <div className="px-4 py-2 text-sm flex justify-between">
                  <button
                    onClick={handleSelectDateRange}
                    className="btn btn-primary text-white px-4 py-2 rounded-md"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleResetDateRange}
                    className="btn border-2 text-red-500 px-4 py-2 rounded-md"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}

            {menuType === MenuType.TASK_CATEGORY && (
              <div className="m-2">
                {/* The user types directly into task.category.categoryName */}
                <input
                  type="text"
                  value={task?.category?.categoryName || ""}
                  onChange={
                    onCategoryChange
                  } /* parent updates task.categoryName */
                  placeholder="Type category name"
                  className="input input-bordered w-full mb-2"
                />

                <ul className="border p-2 rounded shadow bg-white max-h-60 overflow-auto">
                  {displayedCategories.length ? (
                    displayedCategories.map((category) => (
                      <li
                        key={category._id}
                        className="cursor-pointer hover:bg-gray-200 px-2 py-1"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category.categoryName}
                      </li>
                    ))
                  ) : (
                    <li className="px-2 py-1 text-gray-500">
                      Category not exist, add new
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
