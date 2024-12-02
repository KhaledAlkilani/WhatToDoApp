import { Task, TaskFormMode, TaskStatus } from "../../models/TaskModels";
import trashCan from "../../assets/trash-can.svg";
import TaskStatusIcons from "./TaskStatusIcons";
import "../../index.css";
import { useEffect, useState } from "react";
import { searchTasksByName } from "../../services/apiService";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import { getTaskStatus } from "../../utils";
import { useResponsive } from "../../hooks/useResponsive";
import TasksViewHeader from "./TasksViewHeader";

export interface TaskListProps {
  task: Task;
  onSetTask: (value: Task) => void;
  selectedStatus: TaskStatus | null;
  tasksList: Task[];
  onTasksList: (value: Task[]) => void;
  onSelectedStatus: (value: TaskStatus | null) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenTaskModal: (mode: TaskFormMode, taskId?: string) => void;
}

const TaskList = ({
  task,
  onSetTask,
  selectedStatus,
  tasksList,
  onTasksList,
  onSelectedStatus,
  onDeleteTask,
  onOpenTaskModal,
}: TaskListProps) => {
  const [searchTaskName, setSearchTaskName] = useState<string>("");
  const [searchedTasks, setSearchedTasks] = useState<Task[] | null>(null);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const debouncedSearchTaskName = useSearchDebounce(searchTaskName, 500); // Debounce the search input by 500ms
  const isMobileOrTablet = useResponsive();

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
      setSearchedTasks(searchedTasks);
    } catch (err) {
      console.error("Error fetching searched tasks.", err);
    }
  };

  const tasksToRender = (searchedTasks ?? tasksList).filter((task) => {
    // Status filter
    const matchesStatus =
      selectedStatus === null || getTaskStatus(task) === selectedStatus;

    // Combine all filters (search + status)
    return matchesStatus;
  });

  return (
    <>
      <TasksViewHeader
        searchTaskName={searchTaskName}
        selectedStatus={selectedStatus}
        task={task}
        tasksList={tasksList}
        onSetTask={onSetTask}
        onTasksList={onTasksList}
        onSearchTaskName={setSearchTaskName}
        onSelectedStatus={onSelectedStatus}
      />
      {/* Tasks List */}
      <div
        style={{ height: "calc(100vh - 209px)" }}
        className="overflow-y-auto scrollbar-custom h-screen w-full relative"
      >
        <div className="flex flex-wrap justify-start gap-8 pl-10 py-6">
          {tasksToRender.map((task) => (
            <div
              key={task._id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 border border-black rounded-lg p-4 flex flex-col h-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <TaskStatusIcons task={task} />
                  <span className="text-sm font-medium text-gray-700">
                    {getTaskStatus(task)}
                  </span>
                </div>
                <div
                  role="button"
                  onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    onDeleteTask(task._id);
                  }}
                  className="cursor-pointer"
                >
                  <img src={trashCan} width={18} alt="Delete icon" />
                </div>
              </div>

              <h2 className="text-md font-semibold text-gray-800 text-center md:text-left">
                {task.name}
              </h2>

              <div className="text-sm text-gray-600 mt-1 mb-5 flex-1 text-center md:text-left">
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(task.startDate!).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(task.endDate!).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    onOpenTaskModal(TaskFormMode.UPDATE, task._id);
                  }}
                  className="btn btn-primary"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="relative float-end sticky bottom-4 right-12 border shadow-2xl rounded color-white">
          <button
            onClick={() => onOpenTaskModal(TaskFormMode.CREATE)}
            className="btn btn-success rounded text-white"
          >
            Create Task
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskList;
