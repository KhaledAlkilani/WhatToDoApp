import { Task, TaskFormMode } from "../../models/TaskModels";
import TaskForm from "./TaskForm";
import closeIcon from "../../assets/close-icon.svg";

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  mode: TaskFormMode;
  task: Task;
  setTask: React.Dispatch<React.SetStateAction<Task>>;
  tasksList: Task[];
  onDeleteTask: (taskId: string) => Promise<void>;
}

const TaskModal = ({
  onClose,
  onSubmit,
  mode,
  task,
  setTask,
  tasksList,
  onDeleteTask,
}: TaskModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        id="taskModal"
        className="bg-white rounded-lg w-[600px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">
            {mode === TaskFormMode.CREATE ? "New Task" : "Edit Task"}
          </h2>
          <button
            onClick={(e: React.FormEvent) => {
              onClose();
            }}
            className="text-gray-500 text-lg"
          >
            <img src={closeIcon} alt="close icon" width={18} />
          </button>
        </div>
        <TaskForm
          mode={mode}
          onSubmit={onSubmit}
          setTask={setTask}
          task={task}
          tasksList={tasksList}
          onDeleteTask={onDeleteTask}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default TaskModal;
