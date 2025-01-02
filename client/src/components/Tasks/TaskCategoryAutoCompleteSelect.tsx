import { Category } from "../../models/CategoryModel";
import { Task } from "../../models/TaskModels";
import closeIcon from "../../assets/close-icon.svg";
import { useId } from "react";

interface CategoryAutoCompleteSelectProps {
  task?: Task;
  onCategoryChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayedCategories: Category[];
  handleCategorySelect: (category: Category) => void;
  categoriesLoading?: boolean;
  categoriesError?: string | null;
  searchCategory?: string;
  onSearchCategory?: (value: string) => void;
  selectedCategory?: Category;
}

const TaskCategoryAutoCompleteSelect = ({
  task,
  onCategoryChange,
  displayedCategories,
  handleCategorySelect,
  categoriesLoading,
  categoriesError,
  searchCategory,
  onSearchCategory,
  selectedCategory,
}: CategoryAutoCompleteSelectProps) => {
  const id = useId();

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCategoryChange) {
      onCategoryChange(e);
    }
    if (onSearchCategory) {
      onSearchCategory(e.target.value);
    }
  };

  // Handle clearing the input
  const handleClearInput = () => {
    if (onCategoryChange) {
      const event = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onCategoryChange(event);
    }
    if (onSearchCategory) {
      onSearchCategory("");
    }
  };

  // Retrieve the typed value from the selectedCategory (if any), and normalize it by trimming spaces and converting to lowercase
  const typedValue = (task?.category?.categoryName ?? "").trim().toLowerCase();

  // Start with the full list of categories (or an empty array if categories are not provided)
  let categories = displayedCategories || [];

  // Check if the user has typed anything in the input field (non-empty typedValue)
  if (typedValue.length > 0) {
    // 1) Filter the categories by the user's typed input (matching category names)
    categories = categories.filter(
      (cat) => cat.categoryName.toLowerCase().includes(typedValue) // Check if categoryName contains the typed input (case-insensitive)
    );

    // 2) Exclude the selected category from the list to prevent it from showing again after selection
    if (selectedCategory?._id) {
      categories = (categories || []).filter(
        (cat) => cat._id !== selectedCategory._id // Exclude the category with the same ID as the selectedCategory
      );
    }
  }

  return (
    <div className="m-2">
      <div className="relative">
        <input
          id={`taskCategoryField-${id}`}
          type="text"
          value={task?.category?.categoryName || searchCategory}
          onChange={handleInputChange}
          placeholder="Type category name"
          className="input input-bordered w-full mb-2 pr-8"
        />
        {(task?.category?.categoryName || searchCategory) && (
          <button
            onClick={handleClearInput}
            className="absolute right-4 top-5"
            type="button"
          >
            <img src={closeIcon} alt="close icon" width={12} />
          </button>
        )}
      </div>

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
        ) : categories.length ? (
          categories
            .filter(
              (category) =>
                !searchCategory ||
                category.categoryName
                  .toLowerCase()
                  .includes(searchCategory.toLowerCase())
            )
            .map((category) => (
              <li
                key={category._id}
                className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
                onClick={() => handleCategorySelect(category)}
              >
                {category.categoryName}
              </li>
            ))
        ) : (
          <li className="px-2 py-1 text-gray-500">
            {searchCategory
              ? "No categories found. Add new category."
              : "No categories available. Add new."}
          </li>
        )}
      </ul>
    </div>
  );
};

export default TaskCategoryAutoCompleteSelect;
