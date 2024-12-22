import { useEffect, useId, useState } from "react";
import {
  Category,
  MenuType,
  Task,
  TaskFormMode,
  TaskFormOnSubmitStatuses,
} from "../../models/TaskModels";
import { formatDateForInput } from "../../utils";
import Menu from "./Menu";
import { createCategory, getCategories } from "../../services/apiService";

interface TaskFormProps {
  mode: TaskFormMode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  task: Task;
  setTask: React.Dispatch<React.SetStateAction<Task>>;
  tasksList: Task[];
}

const TaskForm = ({
  onSubmit,
  mode,
  setTask,
  task,
  tasksList,
}: TaskFormProps) => {
  const [statusMessage, setStatusMessage] =
    useState<TaskFormOnSubmitStatuses | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    task.category || ""
  );

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({
      ...task,
      name: e.target.value,
    });
  };

  const handleTaskDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTask({
      ...task,
      content: e.target.value,
    });
  };

  const handleTaskCategoryChange = (category: string) => {
    setTask({
      ...task,
      category: category,
    });
  };

  const handleNewCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleTaskStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTask({
      ...task,
      startDate: e.target.value,
    });
  };

  const handleTaskEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({
      ...task,
      endDate: e.target.value,
    });
  };

  const checkFieldsValidation = (): boolean => {
    const isValid = task.name.trim() !== "" && task.content.trim() !== "";
    return !isValid;
  };

  const checkFieldsChange = () => {
    const taskToEdit = tasksList.find((task) => task);
    if (!taskToEdit) return false; // Return false if task not found.

    const isChanged =
      task.name.trim() !== taskToEdit.name.trim() ||
      task.content.trim() !== taskToEdit.content.trim() ||
      formatDateForInput(task.startDate) !==
        formatDateForInput(taskToEdit.startDate) ||
      formatDateForInput(task.endDate) !==
        formatDateForInput(taskToEdit.endDate);

    return isChanged; // Return true if changes have been made
  };

  // Handle adding a new category by calling the createCategory function from apiService
  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await createCategory(newCategory); // Call createCategory from apiService
        setCategories((prev) => [...prev, response]); // Update categories list
        setSelectedCategory(response._id); // Set the newly created category as selected
        setNewCategory(""); // Reset new category input
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if fields are empty
    if (checkFieldsValidation()) {
      setStatusMessage(TaskFormOnSubmitStatuses.FILLINFIELDS); // Show message if fields are empty
      return;
    }

    // If fields are changed (for edit mode), show confirmation prompt
    const canProceed = checkFieldsChange(); // Check if changes were made

    if (!canProceed && mode === TaskFormMode.UPDATE) {
      const userConfirmed = window.confirm(
        `Are you sure you want to change this task: ${task.name}?`
      );
      if (!userConfirmed) {
        return; // Stop if the user cancels
      }
    }

    // If everything is okay, submit the form
    await onSubmit(e); // onSubmit could be either handleCreateTask or handleEditTask

    // Set status message based on the task mode
    if (mode === TaskFormMode.CREATE) {
      setStatusMessage(TaskFormOnSubmitStatuses.TASKCREATED); // Task created successfully
    } else if (mode === TaskFormMode.UPDATE) {
      setStatusMessage(TaskFormOnSubmitStatuses.TASKUPDATED); // Task updated successfully
    }
  };

  const id = useId();

  return (
    <div className="w-full max-w-lg mx-auto">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-6 w-full bg-white p-6"
      >
        <div>
          <label
            htmlFor="taskName"
            className="block text-sm font-semibold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id={`taskName-${id}`}
            value={task.name}
            onChange={handleTaskNameChange}
            className={"input input-bordered w-full"}
          />
        </div>

        <div style={{ overflowY: "auto" }}>
          <label
            htmlFor="taskContent"
            className="block text-sm font-semibold mb-2"
          >
            Description
          </label>
          <textarea
            style={{ resize: "none", height: 80 }}
            id={`taskContent-${id}`}
            value={task.content}
            onChange={handleTaskDescriptionChange}
            className={"input input-bordered w-full"}
          />
        </div>

        {/* Category Selector Menu */}
        <div style={{ overflowY: "auto" }}>
          <Menu
          menuType={MenuType.TASK_CATEGORY}
          categories={categories}
          selectedCategory={selectedCategory}
          newCategory={newCategory}
          onCategoryChange={handleNewCategoryInputChange}
          onCategorySelect={handleTaskCategoryChange}
          onAddCategory={handleAddCategory}
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
            id={`startDate-${id}`}
            value={formatDateForInput(task.startDate)}
            onChange={handleTaskStartDateChange}
            className={"input input-bordered w-full"}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-semibold mb-2">
            End Date
          </label>
          <input
            type="date"
            id={`endDate-${id}`}
            value={formatDateForInput(task.endDate)}
            onChange={handleTaskEndDateChange}
            className={"input input-bordered w-full"}
          />
        </div>

        {/* Status Message */}
        {statusMessage === TaskFormOnSubmitStatuses.FILLINFIELDS && (
          <div className="text-pastelWarning text-sm mt-2">
            Please fill in the fields.
          </div>
        )}

        {statusMessage === TaskFormOnSubmitStatuses.TASKCREATED && (
          <div className="text-pastelGreen text-sm mt-2">
            Task created successfully.
          </div>
        )}

        {statusMessage === TaskFormOnSubmitStatuses.TASKUPDATED && (
          <div className="text-pastelGreen text-sm mt-2">
            Task updated successfully.
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary text-whity"
            disabled={mode === TaskFormMode.UPDATE && !checkFieldsChange()} // Disable button if no changes
          >
            {mode === TaskFormMode.CREATE ? "Add Task" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
