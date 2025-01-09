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
  onSelectedStatus: (value: TaskStatus | null) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenTaskModal: (mode: TaskFormMode, taskId?: string) => void;
}

const TasksList = ({
  loading,
  error,
  tasksList,
  onDeleteTask,
  onOpenTaskModal,
}: TasksListProps) => {
  return (
    <>
      {loading ? (
        <div className="flex justify-center mt-6">
          <span className="loader ease-linear border-4 border-t-4 border-gray-200 rounded-full h-6 w-6 border-t-primary animate-spin mt-2"></span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center mt-4">
          <div className="alert alert-error w-1/3">
            <p>Error fetching tasks: {error}</p>
          </div>
        </div>
      ) : tasksList.length > 0 ? (
        <div
          style={{ height: "calc(100vh - 191px)" }}
          className="overflow-y-auto scrollbar-custom h-screen w-full relative"
        >
          <div className="flex flex-wrap sm:justify-start gap-6 p-[2rem]">
            {tasksList.map((task) => (
              <div
                key={task._id}
                className="card w-full sm:w-[14rem] md:w-[16rem] lg:w-[14rem] shadow-md border border-black rounded-lg p-4"
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
                    onClick={() => {
                      onDeleteTask(task._id);
                    }}
                    className="cursor-pointer"
                  >
                    <img src={trashCan} width={18} alt="Delete icon" />
                  </div>
                </div>

                <h2 className="text-md font-semibold text-gray-800 text-center md:text-left break-words">
                  {task.name}
                </h2>

                <div className="text-sm text-gray-600 mt-1 mb-5 flex-1 text-center md:text-left">
                  {task.category && (
                    <p>
                      <strong>Category: </strong>
                      <span>{task.category.categoryName}</span>
                    </p>
                  )}

                  <p>
                    <strong>Start Date: </strong>
                    {new Date(task.startDate!).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End Date: </strong>
                    {new Date(task.endDate!).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      onOpenTaskModal(TaskFormMode.UPDATE, task._id);
                    }}
                    className="btn btn-primary text-white"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-4">
          <p className="text-black">No tasks found</p>
        </div>
      )}
    </>
  );
};

export default TasksList;
