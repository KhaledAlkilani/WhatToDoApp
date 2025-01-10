import { useId, useState } from "react";
import { MenuType, Task, TaskStatus } from "../../models/TaskModels";
import closeIcon from "../../assets/close-icon.svg";
import downArrow from "../../assets/arrow-down.svg";
import { Category } from "../../models/CategoryModel";
import TaskCategoryAutoCompleteSelect from "./TaskCategoryAutoCompleteSelect";
import TaskDateRangeSelect from "./TaskDateRangeSelect";
import TaskStatusSelect from "./TaskStatusSelect";

interface MenuProps {
  menuType: MenuType;
  selectedStatus?: TaskStatus | null;
  task?: Task;
  selectedCategory?: Category;
  categories?: Category[];
  categoriesLoading?: boolean;
  categoriesError?: string | null;
  styles?: string;
  searchTask?: string;
  searchCategory?: string;
  onSelectStatus?: (status: TaskStatus | null) => void;
  onSetTask?: (value: Task) => void;
  onApplyDateRange?: () => Promise<void>;
  onCategorySelect?: (category: Category) => void;
  onCategoryChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFetchPagedTasks?: (
    page: number,
    status: TaskStatus | null,
  ) => Promise<void>;
  onSearchTask?: (value: string) => void;
  onSearchCategory?: (value: string) => void;
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
  searchTask,
  searchCategory,
  onCategorySelect,
  onCategoryChange,
  onSetTask,
  onSelectStatus,
  onApplyDateRange,
  onFetchPagedTasks,
  onSearchTask,
  onSearchCategory,
}: MenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const id = useId();

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
      startDate: new Date(),
      endDate: new Date(),
    };
    onSetTask?.(resetTask);
    await onFetchPagedTasks?.(1, selectedStatus || null);
  };

  const handleCategorySelect = (category: Category) => {
    onCategorySelect?.(category);
    onSearchCategory?.(category.categoryName);
    onSearchTask?.(category.categoryName);
    setIsMenuOpen(false);
  };

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

        {menuType === MenuType.TASK_SEARCH && (
          <>
            <div className="flex flex-1">
              <span
                className={
                  selectedCategory?.categoryName
                    ? "text-black-900"
                    : "text-gray-500"
                }
              >
                {(!isMenuOpen && searchCategory) ||
                  "Search task by name or category"}
              </span>
            </div>

            <img
              src={closeIcon}
              alt="close icon"
              width={12}
              onClick={() => {
                onCategorySelect?.({ _id: "", categoryName: "" });
                onSearchCategory?.("");
                onSearchTask?.("");
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
                displayedCategories={categories || []}
                handleCategorySelect={handleCategorySelect}
                onCategoryChange={onCategoryChange}
                searchCategory={searchCategory}
                onSearchCategory={onSearchCategory}
                selectedCategory={selectedCategory}
              />
            )}

            {menuType === MenuType.TASK_SEARCH && (
              <>
                <input
                  type="text"
                  id={`searchField-${id}`}
                  placeholder="Type task name or category here"
                  value={searchTask || searchCategory}
                  onChange={(e) => {
                    onSearchTask?.(e.target.value);
                    onSearchCategory?.(e.target.value);
                  }}
                  className="input input-bordered w-full md:w-80"
                />
                <ul className="border p-2 rounded shadow bg-white max-h-60 overflow-auto">
                  {categoriesLoading ? (
                    <div className="flex justify-center items-center py-2">
                      <div className="loader ease-linear border-4 border-t-4 border-gray-200 rounded-full h-6 w-6 border-t-primary animate-spin"></div>
                    </div>
                  ) : categoriesError ? (
                    <li className="alert alert-error mb-2">
                      <span className="text-white">
                        Error fetching categories: {categoriesError}
                      </span>
                    </li>
                  ) : categories?.length ? (
                    categories.map((category) => (
                      <li
                        key={category._id}
                        className="cursor-pointer hover:bg-gray-200 px-2 py-1"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category.categoryName}
                      </li>
                    ))
                  ) : (
                    <li className="px-2 py-1 text-gray-500">
                      No categories available.
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
