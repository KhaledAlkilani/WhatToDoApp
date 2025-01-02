import { useId, useState } from "react";
import {
  MenuType,
  Task,
  TaskFormMode,
  TaskFormOnSubmitStatuses,
} from "../../models/TaskModels";
import { formatDateForInput } from "../../utils";
import { Category } from "../../models/CategoryModel";
import Menu from "./Menu";
import useCategories from "../../hooks/useCategories";

interface TaskFormProps {
  mode: TaskFormMode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  task: Task;
  setTask: React.Dispatch<React.SetStateAction<Task>>;
  tasksList: Task[];
  onClose: () => void;
}

const TaskForm = ({
  onSubmit,
  mode,
  setTask,
  task,
  tasksList,
  onClose,
}: TaskFormProps) => {
  const [statusMessage, setStatusMessage] =
    useState<TaskFormOnSubmitStatuses | null>(null);

  const { categories, loading, error, handleSearchCategory, searchCategory } =
    useCategories();

  const id = useId();

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

  const handleTaskCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prev) => ({
      ...prev,
      category: {
        ...prev.category,
        categoryName: e.target.value,
        _id: prev.category?._id || "",
      },
    }));
  };

  const handleCategorySelect = (category: Category) => {
    setTask((prevTask) => ({
      ...prevTask,
      category: category,
    }));
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
    const isValid =
      task.name.trim() !== "" &&
      task.content.trim() !== "" &&
      task.category?.categoryName.trim() !== "";
    return !isValid;
  };

  const checkFieldsChange = () => {
    const taskToEdit = tasksList.find((t) => t._id === task._id);
    if (!taskToEdit) return false;

    const isChanged =
      task.name.trim() !== taskToEdit.name.trim() ||
      task.content.trim() !== taskToEdit.content.trim() ||
      task.category?.categoryName !== taskToEdit.category?.categoryName ||
      formatDateForInput(task.startDate) !==
        formatDateForInput(taskToEdit.startDate) ||
      formatDateForInput(task.endDate) !==
        formatDateForInput(taskToEdit.endDate);

    return isChanged; // Return true if changes have been made
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
            Name *
          </label>
          <input
            type="text"
            id={`taskName-${id}`}
            value={task.name}
            onChange={handleTaskNameChange}
            className={"input input-bordered w-full"}
            placeholder="Type task name"
          />
        </div>

        <div style={{ overflowY: "auto" }}>
          <label
            htmlFor="taskContent"
            className="block text-sm font-semibold mb-2"
          >
            Description *
          </label>
          <textarea
            style={{ resize: "none", height: 80 }}
            id={`taskContent-${id}`}
            value={task.content}
            onChange={handleTaskDescriptionChange}
            className={"input input-bordered w-full"}
            placeholder="Type task description"
          />
        </div>

        <div>
          <label
            htmlFor="taskName"
            className="block text-sm font-semibold mb-2"
          >
            Category *
          </label>
          <Menu
            menuType={MenuType.TASK_CATEGORY}
            categories={categories}
            categoriesLoading={loading}
            categoriesError={error}
            task={task}
            selectedCategory={task.category}
            onCategorySelect={handleCategorySelect}
            onCategoryChange={handleTaskCategoryChange}
            styles="w-full h-11"
            searchCategory={searchCategory}
            onSearchCategory={handleSearchCategory}
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
            Please fill in the required fields.
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
        <div className="flex justify-end gap-4">
          <button
            onClick={(e: React.FormEvent) => {
              onClose();
            }}
            type="button"
            className="btn btn-outline text-error border-error hover:bg-error hover:border-error"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn ${
              mode === TaskFormMode.UPDATE && !checkFieldsChange()
                ? "!text-pastelGray !border-pastelGray hover:!bg-pastelLightGray"
                : "btn-primary text-whity"
            }`}
            disabled={mode === TaskFormMode.UPDATE && !checkFieldsChange()}
          >
            {mode === TaskFormMode.CREATE ? "Add Task" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
