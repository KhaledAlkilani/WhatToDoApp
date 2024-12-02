import { useId } from "react";
import { MenuType, Task, TaskStatus } from "../../models/TaskModels";
import Menu from "./Menu";
import { getTasksByDateRange } from "../../services/apiService";

interface TasksViewHeaderProps {
  searchTaskName: string;
  tasksList: Task[];
  task: Task;
  selectedStatus: TaskStatus | null;
  onSearchTaskName: (value: string) => void;
  onSetTask: (value: Task) => void;
  onSelectedStatus: (value: TaskStatus | null) => void;
  onTasksList: (value: Task[]) => void;
}

const TasksViewHeader = ({
  searchTaskName,
  tasksList,
  task,
  selectedStatus,
  onSearchTaskName,
  onSetTask,
  onSelectedStatus,
  onTasksList,
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
      <div className="p-8">
        <h1 className="font-bold text-2xl text-center md:text-left">Tasks</h1>
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
            placeholder="Search tasks by name"
            value={searchTaskName}
            onChange={(e) => onSearchTaskName(e.target.value)}
            className="input input-bordered w-full md:w-80"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-6">
          <Menu
            menuType={MenuType.DATE_RANGE}
            onApplyDateRange={handleApplyDateRange}
            tasksList={tasksList}
            task={task}
            onSetTask={onSetTask}
          />
          <Menu
            menuType={MenuType.STATUS}
            onSelectStatus={(status: TaskStatus | null) =>
              onSelectedStatus(status)
            }
            selectedStatus={selectedStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default TasksViewHeader;
