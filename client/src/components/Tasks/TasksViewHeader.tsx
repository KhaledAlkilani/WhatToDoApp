import {
  MenuType,
  Task,
  TaskFormMode,
  TaskStatus,
} from "../../models/TaskModels";
import Menu from "./Menu";
import { getTasksByDateRange } from "../../services/apiService";
import useCategories from "../../hooks/useCategories";

interface TasksViewHeaderProps {
  searchTaskName: string;
  task: Task;
  selectedStatus: TaskStatus | null;
  onSearchTaskName: (value: string) => void;
  onSetTask: (value: Task) => void;
  onSelectedStatus: (value: TaskStatus | null) => void;
  onSetTasksList: (value: Task[]) => void;
  onOpenTaskModal: (mode: TaskFormMode, taskId?: string) => void;
  onFetchPagedTasks?: (
    page: number,
    status: TaskStatus | null,
  ) => Promise<void>;
}

const TasksViewHeader = ({
  searchTaskName,
  task,
  selectedStatus,
  onSearchTaskName,
  onSetTask,
  onSelectedStatus,
  onSetTasksList,
  onOpenTaskModal,
  onFetchPagedTasks,
}: TasksViewHeaderProps) => {
  const {
    categories,
    loading,
    error,
    searchCategory,
    handleSearchCategory,
    selectedCategory,
    updateSelectedCategory,
  } = useCategories();

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
      onSetTasksList(tasksInDateRange);
    } catch (err) {
      console.error("Error fetching tasks in date range:", err);
    }
  };

  return (
    <div className="sticky top-0 bg-white z-10 shadow">
      <div className="flex justify-between p-8">
        <h1 className="font-bold text-2xl text-center md:text-left">Tasks</h1>
        <div className="relative float-end sticky top-4 right-12 border shadow-2xl rounded color-white">
          <button
            onClick={() => onOpenTaskModal(TaskFormMode.CREATE)}
            className="btn btn-success rounded text-whity"
          >
            Create Task
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row px-4 md:px-10 md:items-end">
        <div className="flex-1 mb-4 md:mb-6">
          <Menu
            menuType={MenuType.TASK_SEARCH}
            styles="w-full md:w-80"
            onSearchTask={onSearchTaskName}
            searchTask={searchTaskName}
            categories={categories}
            categoriesLoading={loading}
            categoriesError={error}
            searchCategory={searchCategory}
            onSearchCategory={handleSearchCategory}
            onCategorySelect={updateSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-6">
          <Menu
            menuType={MenuType.DATE_RANGE}
            onApplyDateRange={handleApplyDateRange}
            onFetchPagedTasks={onFetchPagedTasks}
            task={task}
            onSetTask={onSetTask}
            styles="w-full md:w-60 lg:w-60 z-30"
          />

          <Menu
            menuType={MenuType.STATUS}
            onSelectStatus={(status: TaskStatus | null) =>
              onSelectedStatus(status)
            }
            selectedStatus={selectedStatus}
            styles="w-full md:w-60 lg:w-60"
          />
        </div>
      </div>
    </div>
  );
};

export default TasksViewHeader;
