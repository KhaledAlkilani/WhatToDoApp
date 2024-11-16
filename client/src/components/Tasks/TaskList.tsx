import { useState } from "react";
import { Task, TaskFormMode } from "../../models/TaskModels";
import arrowDown from "../../assets/arrow-down.svg";
import trashCan from "../../assets/trash-can.svg";
import editIcon from "../../assets/edit-icon.svg";
import TaskStatusIcons from "./TaskStatusIcons";

export interface TaskListProps {
  tasksList: Task[];
  onDeleteTask: (taskId: string) => void;
  onOpenEditTaskModal: (mode: TaskFormMode, taskId?: string) => void;
}

const TaskList = ({
  onDeleteTask,
  tasksList,
  onOpenEditTaskModal,
}: TaskListProps) => {
  const [openTaskAccordion, setOpenTaskAccordion] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleTaskAccordion = (index: number, e: React.FormEvent) => {
    e.preventDefault();

    setOpenTaskAccordion((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <ul className="mt-3 w-full max-w-lg list-disc list-inside text-left">
      {tasksList.map((task, index) => {
        return (
          <div key={task._id} className="mb-4 w-full">
            <div
              onClick={(e) => toggleTaskAccordion(index, e)}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer"
            >
              <TaskStatusIcons task={task} />
              <h2 className="text-xl font-semibold flex-1 ml-3">{task.name}</h2>
              <div className="flex">
                <div
                  role="button"
                  tabIndex={0}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    onDeleteTask(task._id!);
                  }}
                >
                  <img
                    src={trashCan}
                    style={{
                      filter: "red",
                    }}
                    width={18}
                    alt="Close icon"
                  />
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  className="ml-4"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    onOpenEditTaskModal(TaskFormMode.UPDATE, task._id);
                  }}
                >
                  <img src={editIcon} width={18} alt="Edit icon" />
                </div>

                <img
                  src={arrowDown}
                  alt="Toggle arrow"
                  className={`w-5 h-5 transition-transform duration-300 ml-2 ${
                    openTaskAccordion[index] ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {openTaskAccordion[index] && (
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col space-y-2">
                  <div>
                    <strong>Name: </strong>
                    <p>{task.name}</p>
                  </div>
                  <div>
                    <strong>Content: </strong>
                    <p>{task.content}</p>
                  </div>
                  <div>
                    <strong>Start Date: </strong>
                    <p>{new Date(task.startDate!).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <strong>End Date: </strong>
                    <p>{new Date(task.endDate!).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="btn btn-error text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </ul>
  );
};

export default TaskList;
