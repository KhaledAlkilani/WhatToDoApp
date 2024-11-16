import { Task, TaskFormMode } from "../../models/TaskModels";
import CreateTask from "./CreateTask";

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  mode: TaskFormMode;
  newTask: Task;
  setNewTask: React.Dispatch<React.SetStateAction<Task>>;
}

const TaskModal = ({
  onClose,
  onSubmit,
  mode,
  newTask,
  setNewTask,
}: TaskModalProps) => {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          id="taskModal"
          className="bg-white rounded-lg w-[600px] p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {mode === TaskFormMode.CREATE ? "Create Task" : "Edit Task"}
            </h2>
            <button
              onClick={(e: React.FormEvent) => {
                onClose();
                e.preventDefault();
              }}
              className="text-gray-500 text-lg"
            >
              &times;
            </button>
          </div>
          <CreateTask
            mode={mode}
            onSubmit={onSubmit}
            setNewTask={setNewTask}
            newTask={newTask}
          />
        </div>
      </div>
    </>
  );
};

export default TaskModal;
