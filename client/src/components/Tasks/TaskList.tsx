import {
  MenuType,
  Task,
  TaskFormMode,
  TaskStatus,
} from "../../models/TaskModels";
import trashCan from "../../assets/trash-can.svg";
import editIcon from "../../assets/edit-icon.svg";
import TaskStatusIcons from "./TaskStatusIcons";
import "../../index.css";
import { useEffect, useId, useState } from "react";
import Menu from "./Menu";
import {
  getTasksByDateRange,
  searchTasksByName,
} from "../../services/apiService";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import { getTaskStatus } from "../../utils";

export interface TaskListProps {
  task: Task;
  onSetTask: (value: Task) => void;
  selectedStatus: TaskStatus | null;
  tasksList: Task[];
  onTasksList: (value: Task[]) => void;
  onSelectedStatus: (value: TaskStatus | null) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenEditTaskModal: (mode: TaskFormMode, taskId?: string) => void;
}

const TaskList = ({
  task,
  onSetTask,
  selectedStatus,
  tasksList,
  onTasksList,
  onSelectedStatus,
  onDeleteTask,
  onOpenEditTaskModal,
}: TaskListProps) => {
  const [searchTaskName, setSearchTaskName] = useState<string>("");
  const [searchedTasks, setSearchedTasks] = useState<Task[] | null>(null);

  const debouncedSearchTaskName = useSearchDebounce(searchTaskName, 500); // Debounce the search input by 500ms

  useEffect(() => {
    handleSearchTasks();
  }, [debouncedSearchTaskName]);

  const handleSearchTasks = async () => {
    if (debouncedSearchTaskName.trim() === "") {
      setSearchedTasks(null);
      return;
    }
    try {
      const searchedTasks = await searchTasksByName(debouncedSearchTaskName);
      setSearchedTasks(searchedTasks); // Set filtered tasks
    } catch (err) {
      console.error("Error fetching searched tasks.", err);
    }
  };

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

  const tasksToRender = (searchedTasks ?? tasksList).filter((task) => {
    // Status filter
    const matchesStatus =
      selectedStatus === null || getTaskStatus(task) === selectedStatus;

    // Combine all filters (search + status)
    return matchesStatus;
  });

  const id = useId();

  return (
    <>
      <div className="flex px-10 border-b-2 border-gray-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex-1 mb-6">
          <label htmlFor="search" className="block mb-2">
            Search
          </label>
          <input
            type="text"
            id={`searchField-${id}`}
            placeholder="Search tasks by name"
            value={searchTaskName}
            onChange={(e) => setSearchTaskName(e.target.value)}
            className="input input-bordered w-96"
          />
        </div>

        <div className="flex items-end space-x-4 mb-6">
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

      <div
        style={{ height: "calc(100vh - 209px)" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-y-auto scrollbar-custom"
      >
        {tasksToRender.map((task) => (
          <div key={task._id} className="w-full shadow-lg rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <TaskStatusIcons task={task} />
              <h2 className="text-lg font-semibold text-gray-800">
                {task.name}
              </h2>
              <div className="flex items-center space-x-4">
                <div
                  role="button"
                  onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    onDeleteTask(task._id);
                  }}
                >
                  <img src={trashCan} width={18} alt="Delete icon" />
                </div>
                <div
                  role="button"
                  onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    onOpenEditTaskModal(TaskFormMode.UPDATE, task._id);
                  }}
                >
                  <img src={editIcon} width={18} alt="Edit icon" />
                </div>
              </div>
            </div>

            {/* Task Details */}
            <div className="mt-2-50 p-4 rounded-md">
              <p>
                <strong>Content:</strong> {task.content}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(task.startDate!).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(task.endDate!).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskList;
