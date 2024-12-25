import { useId } from "react";
import {
  MenuType,
  Task,
  TaskFormMode,
  TaskStatus,
} from "../../models/TaskModels";
import Menu from "./Menu";
import { getTasksByDateRange } from "../../services/apiService";

interface TasksViewHeaderProps {
  searchTaskName: string;
  task: Task;
  selectedStatus: TaskStatus | null;
  onSearchTaskName: (value: string) => void;
  onSetTask: (value: Task) => void;
  onSelectedStatus: (value: TaskStatus | null) => void;
  onTasksList: (value: Task[]) => void;
  onOpenTaskModal: (mode: TaskFormMode, taskId?: string) => void;
}

const TasksViewHeader = ({
  searchTaskName,
  task,
  selectedStatus,
  onSearchTaskName,
  onSetTask,
  onSelectedStatus,
  onTasksList,
  onOpenTaskModal,
}: TasksViewHeaderProps) => {
  const handleApplyDateRange = async () => {
    if (!task.startDate || !task.endDate) {
      console.error("Start date or end date is missing.");
      return;
    }

    try {
      const startDate =
        typeof task.startDate === "string"
          ? task.startDate
          : task.startDate.toLocaleString();

      const endDate =
        typeof task.endDate === "string"
          ? task.endDate
          : task.endDate.toLocaleString();

      const tasksInDateRange = await getTasksByDateRange(startDate, endDate);
      onTasksList(tasksInDateRange);
    } catch (err) {
      console.error("Error fetching tasks in date range:", err);
    }
  };

  const id = useId();

  return (
    <div className="sticky top-0 bg-white z-10 shadow">
      <div className="flex justify-between p-8">
        <h1 className="font-bold text-2xl text-center md:text-left">Tasks</h1>
        <div className="relative float-end sticky top-4 right-12 border shadow-2xl rounded color-white">
          <button
            onClick={() => onOpenTaskModal(TaskFormMode.CREATE)}
            className="btn btn-success rounded text-white"
          >
            Create Task
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row px-4 md:px-10 md:items-end">
        <div className="flex-1 mb-4 md:mb-6">
          <label
            htmlFor="search"
            className="block mb-2 text-center md:text-left"
          >
            Search
          </label>
          <input
            type="text"
            id={`searchField-${id}`}
            placeholder="Search task by name"
            value={searchTaskName}
            onChange={(e) => onSearchTaskName(e.target.value)}
            className="input input-bordered w-full md:w-80"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-6">
          <Menu
            menuType={MenuType.DATE_RANGE}
            onApplyDateRange={handleApplyDateRange}
            task={task}
            onSetTask={onSetTask}
            styles="w-60"
          />
          <Menu
            menuType={MenuType.STATUS}
            onSelectStatus={(status: TaskStatus | null) =>
              onSelectedStatus(status)
            }
            selectedStatus={selectedStatus || ""}
            styles="w-60"
          />
        </div>
      </div>
    </div>
  );
};

export default TasksViewHeader;
