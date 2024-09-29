import { TaskListProps } from "../types";
import deleteIcon from "../assets/delete-button-svgrepo-com.svg";

const TaskList: React.FC<TaskListProps> = (props) => {
  const { tasksList, onDeleteTask } = props;
  return (
    <ul className="mt-6 w-full max-w-lg list-disc list-inside text-left">
      {tasksList.tasksData.map((task) => {
        return (
          <div
            key={task.id}
            className="mb-2 flex flex-row items-center justify-start w-3/4"
          >
            <li className="flex-1">{task.name}</li>
            <button onClick={() => onDeleteTask(task.id)}>
              <img src={deleteIcon} width={14} alt="" />
            </button>
          </div>
        );
      })}
    </ul>
  );
};

export default TaskList;
