import { TaskStatus } from "../../models/TaskModels";

interface TaskStatusSelectProps {
  onSelectStatus?: (status: TaskStatus) => void;
}

const TaskStatusSelect = ({ onSelectStatus }: TaskStatusSelectProps) => {
  return (
    <div className="py-1">
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        onClick={() => onSelectStatus?.(TaskStatus.NEW)}
      >
        {TaskStatus.NEW}
      </a>
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        onClick={() => onSelectStatus?.(TaskStatus.IN_PROGRESS)}
      >
        {TaskStatus.IN_PROGRESS}
      </a>
      <a
        href="#"
        className="text-gray-700 block px-4 py-2 text-sm"
        onClick={() => onSelectStatus?.(TaskStatus.DONE)}
      >
        {TaskStatus.DONE}
      </a>
    </div>
  );
};

export default TaskStatusSelect;
