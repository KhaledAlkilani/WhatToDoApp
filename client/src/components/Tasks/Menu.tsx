import { useState } from "react";
import { MenuType, Task, TaskStatus } from "../../models/TaskModels";
import closeIcon from "../../assets/close-icon.svg";
import downArrow from "../../assets/arrow-down.svg";
import { Category } from "../../models/CategoryModel";
import TaskCategoryAutoCompleteSelect from "./TaskCategoryAutoCompleteSelect";
import TaskDateRangeSelect from "./TaskDateRangeSelect";
import TaskStatusSelect from "./TaskStatusSelect";

interface MenuProps {
  menuType: MenuType;
  selectedStatus?: string;
  task?: Task;
  selectedCategory?: Category;
  categories?: Category[];
  categoriesLoading?: boolean;
  categoriesError?: string | null;
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
  categoriesLoading,
  categoriesError,
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

  const handleCategorySelect = (category: Category) => {
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
            <span>Select date range</span>
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
              <TaskStatusSelect onSelectStatus={handleSelectStatus} />
            )}
            {menuType === MenuType.DATE_RANGE && (
              <TaskDateRangeSelect
                task={task}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
                onSelectDateRange={handleSelectDateRange}
                onResetDateRange={handleResetDateRange}
              />
            )}

            {menuType === MenuType.TASK_CATEGORY && (
              <TaskCategoryAutoCompleteSelect
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
                task={task}
                displayedCategories={displayedCategories}
                handleCategorySelect={handleCategorySelect}
                onCategoryChange={onCategoryChange}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
