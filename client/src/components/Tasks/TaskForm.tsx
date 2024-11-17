import { useState } from "react";
import { Task, TaskFormMode } from "../../models/TaskModels";
import { formatDateForInput } from "../../utils";

interface TaskFormProps {
  mode: TaskFormMode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  task: Task;
  setNewTask: React.Dispatch<React.SetStateAction<Task>>;
  tasksList: Task[];
}

const TaskForm = ({
  onSubmit,
  mode,
  setNewTask,
  task,
  tasksList,
}: TaskFormProps) => {
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
      ...task,
      name: e.target.value,
    });
  };

  const handleTaskContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
      ...task,
      content: e.target.value,
    });
  };

  const handleTaskStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTask({
      ...task,
      startDate: e.target.value,
    });
  };

  const handleTaskEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
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

    if (!taskToEdit) return;

    const isChanged =
      task.name.trim() !== taskToEdit.name.trim() ||
      task.content.trim() !== taskToEdit.content.trim() ||
      formatDateForInput(task.startDate) !==
        formatDateForInput(taskToEdit.startDate) ||
      formatDateForInput(task.endDate) !==
        formatDateForInput(taskToEdit.endDate);

    return !isChanged;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true); // User has attempted to submit

    const canProceed = checkFieldsChange(); // Only show the alert if changes have been made

    // If fields are changed, show a confirmation prompt
    if (!canProceed) {
      const userConfirmed = window.confirm(
        `Are you sure you want to change this task: ${task.name}?`
      );
      if (!userConfirmed) {
        return; // If the user cancels, stop the submission
      }
    }

    // If validation fails, return early and don't submit the form
    if (checkFieldsValidation()) {
      return;
    }

    // If validation passes, proceed with the actual submission
    await onSubmit(e);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form
        onSubmit={handleFormSubmit}
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
            value={task.name}
            onChange={handleTaskNameChange}
            className={"input input-bordered w-full"}
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
            value={task.content}
            onChange={handleTaskContentChange}
            className={"input input-bordered w-full"}
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
            id="endDate"
            value={formatDateForInput(task.endDate)}
            onChange={handleTaskEndDateChange}
            className={"input input-bordered w-full"}
          />
        </div>

        {hasAttemptedSubmit && checkFieldsValidation() && (
          <div className="text-red-500 text-sm mt-2">
            Please fill in the fields.
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-success text-white"
            disabled={mode === TaskFormMode.UPDATE && checkFieldsChange()}
          >
            {mode === TaskFormMode.CREATE ? "Create Task" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
