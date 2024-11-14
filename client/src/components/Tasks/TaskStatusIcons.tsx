import greenCircle from "../assets/green-circle-icon.svg";
import blueCircle from "../assets/blue-circle-icon.svg";
import orangeCircle from "../assets/orange-circle-icon.svg";
import { Task, TaskStatus } from "../../models/TaskModels";
import { getTaskStatus } from "../../utils/getTaskStatus";

interface TaskStatusIconsProps {
  task: Task;
}

const TaskStatusIcons = ({ task }: TaskStatusIconsProps) => {
  const taskStatus = getTaskStatus(task);

  let icon;

  if (taskStatus === TaskStatus.NEW) {
    icon = blueCircle;
  } else if (taskStatus === TaskStatus.DONE) {
    icon = greenCircle;
  } else if (taskStatus === TaskStatus.IN_PROGRESS) {
    icon = orangeCircle;
  }

  return (
    <div className="flex items-center space-x-2">
      <img src={icon} alt={`${taskStatus} icon`} className="w-4 h-4" />
    </div>
  );
};

export default TaskStatusIcons;
