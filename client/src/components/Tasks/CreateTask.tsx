import { Task, TaskFormMode } from "../../models/TaskModels";

interface CreateTaskProps {
  mode: TaskFormMode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  newTask: Task;
  setNewTask: React.Dispatch<React.SetStateAction<Task>>;
}

const CreateTask = ({
  onSubmit,
  mode,
  setNewTask,
  newTask,
}: CreateTaskProps) => {
  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
      ...newTask,
      name: e.target.value,
    });
  };

  const handleTaskContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
      ...newTask,
      content: e.target.value,
    });
  };

  const handleTaskStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTask({
      ...newTask,
      startDate: e.target.value,
    });
  };

  const handleTaskEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask({
      ...newTask,
      endDate: e.target.value,
    });
  };

  // Format date to string, or return an empty string for null or undefined
  const formatDateForInput = (
    date: Date | string | null | undefined
  ): string => {
    if (!date) return ""; // Return empty if null or undefined

    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }

    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form
        onSubmit={onSubmit}
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
            value={newTask.name}
            onChange={handleTaskNameChange}
            className="input input-bordered w-full"
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
            value={newTask.content}
            onChange={handleTaskContentChange}
            className="input input-bordered w-full"
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
            value={formatDateForInput(newTask.startDate)}
            onChange={handleTaskStartDateChange}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-semibold mb-2">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={formatDateForInput(newTask.endDate)}
            onChange={handleTaskEndDateChange}
            className="input input-bordered w-full"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-success text-white">
            {mode === TaskFormMode.CREATE ? "Create Task" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
