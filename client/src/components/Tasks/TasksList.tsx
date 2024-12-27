import { Task, TaskFormMode, TaskStatus } from "../../models/TaskModels";
import trashCan from "../../assets/trash-can.svg";
import TaskStatusIcons from "./TaskStatusIcons";
import "../../index.css";
import { getTaskStatus } from "../../utils";

export interface TasksListProps {
  loading: boolean;
  error: string | null;
  selectedStatus: TaskStatus | null;
  tasksList: Task[];
  searchedTasks: Task[] | null;
  onSelectedStatus: (value: TaskStatus | null) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenTaskModal: (mode: TaskFormMode, taskId?: string) => void;
}

const TasksList = ({
  loading,
  error,
  searchedTasks,
  selectedStatus,
  tasksList,
  onDeleteTask,
  onOpenTaskModal,
}: TasksListProps) => {
  const tasksToRender = (searchedTasks ?? tasksList).filter((task) => {
    // Status filter
    const matchesStatus =
      selectedStatus === null || getTaskStatus(task) === selectedStatus;

    // Combine all filters (search + status)
    return matchesStatus;
  });

  return (
    <>
      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center mt-6">
          <span className="loading loading-dots loading-md mt-2"></span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center mt-4">
          <div className="alert alert-error w-1/3">
            <p>Error fetching tasks: {error}</p>
          </div>
        </div>
      ) : (
        <div
          style={{ height: "calc(100vh - 220px)" }}
          className="overflow-y-auto scrollbar-custom h-screen w-full relative"
        >
          <div className="flex flex-wrap sm:justify-start gap-6 p-[2rem]">
            {tasksToRender.map((task) => (
              <div
                key={task._id}
                className="w-full sm:w-[14rem] md:w-[16rem] lg:w-[14rem] border border-black rounded-lg p-4 flex flex-col h-auto"
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
                    className="btn btn-primary text-whity"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TasksList;
