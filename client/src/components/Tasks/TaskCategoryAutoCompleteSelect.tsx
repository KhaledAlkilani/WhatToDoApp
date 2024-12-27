import { Category } from "../../models/CategoryModel";
import { Task } from "../../models/TaskModels";

interface CategoryAutoCompleteSelectProps {
  task?: Task;
  onCategoryChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayedCategories: Category[];
  handleCategorySelect: (category: Category) => void;
  categoriesLoading?: boolean;
  categoriesError?: string | null;
}

const TaskCategoryAutoCompleteSelect = ({
  task,
  onCategoryChange,
  displayedCategories,
  handleCategorySelect,
  categoriesLoading,
  categoriesError,
}: CategoryAutoCompleteSelectProps) => {
  return (
    <div className="m-2">
      {/* The user types directly into task.category.categoryName */}
      <input
        type="text"
        value={task?.category?.categoryName || ""}
        onChange={onCategoryChange} /* parent updates task.categoryName */
        placeholder="Type category name"
        className="input input-bordered w-full mb-2"
      />

      <ul className="border p-2 rounded shadow bg-white max-h-60 overflow-auto">
        {/* Show loading indicator if categories are loading */}
        {categoriesLoading ? (
          <div className="flex justify-center items-center py-2">
            <div className="loader ease-linear border-4 border-t-4 border-gray-200 rounded-full h-6 w-6 border-t-primary animate-spin"></div>
          </div>
        ) : categoriesError ? (
          // Show error message if there is an error
          <li className="alert alert-error mb-2">
            <span className="text-white">
              Error fetching categories: {categoriesError}
            </span>
          </li>
        ) : displayedCategories.length ? (
          // If categories are available, display them
          displayedCategories.map((category) => (
            <li
              key={category._id}
              className="cursor-pointer hover:bg-gray-200 px-2 py-1"
              onClick={() => handleCategorySelect(category)}
            >
              {category.categoryName}
            </li>
          ))
        ) : (
          // If no categories available
          <li className="px-2 py-1 text-gray-500">
            No categories available. Add new.
          </li>
        )}
      </ul>
    </div>
  );
};

export default TaskCategoryAutoCompleteSelect;
