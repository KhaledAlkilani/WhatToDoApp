import { TaskListProps } from "../types";

const TaskList = ({ onDeleteTask, tasksList }: TaskListProps) => {
  return (
    <ul className="mt-6 w-full max-w-lg list-disc list-inside text-left">
      {tasksList.tasksData.map((task) => {
        return (
          <div
            key={task.id}
            className="mb-2 p-3 flex flex-row items-center justify-start w-6/7 bg-neutral-100 rounded-box"
          >
            <span className="flex-1">{task.name}</span>
            <button
              className="btn btn-error px-3"
              onClick={() => onDeleteTask(task.id)}
            >
              <span className="text-white">Delete</span>
            </button>
          </div>
        );
      })}
    </ul>
  );
};

export default TaskList;
