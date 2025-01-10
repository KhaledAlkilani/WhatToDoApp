import { useEffect, useState } from "react";
import { Task, TaskFormMode, TaskStatus } from "../../models/TaskModels";
import TasksList from "./TasksList";
import {
  createTask,
  deleteTask,
  editTask,
  getTasksWithPagination,
} from "../../services/apiService";
import TaskModal from "./TaskModal";
import TasksViewHeader from "./TasksViewHeader";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import previousArrow from "../../assets/previous-arrow-back.svg";
import nextArrow from "../../assets/right-arrow-next.svg";

const initialData: Task = {
  _id: "",
  name: "",
  content: "",
  startDate: new Date(),
  endDate: new Date(),
  category: { _id: "", categoryName: "" },
};

const Tasks = () => {
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<TaskFormMode>(TaskFormMode.CREATE);
  const [task, setTask] = useState<Task>(initialData);
  const [searchTaskName, setSearchTaskName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const debouncedSearchTask = useSearchDebounce(searchTaskName, 500); // Debounce the search input by 500ms

  useEffect(() => {
    // When search or status changes, reset to page 1
    setCurrentPage(1);
  }, [debouncedSearchTask, selectedStatus]);

  useEffect(() => {
    // Fetch tasks whenever currentPage, selectedStatus, or search changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchPagedTasks(currentPage, selectedStatus);
  }, [currentPage, selectedStatus, debouncedSearchTask]);

  // Fetch tasks whenever currentPage changes
  const fetchPagedTasks = async (page: number, status: TaskStatus | null) => {
    setLoading(true);
    try {
      const data = await getTasksWithPagination(
        page,
        status,
        debouncedSearchTask,
      );
      setTasksList(data.tasks);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch tasks");
      console.error("Failed to fetch tasks", error);
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderNoTasksMessage = () => {
    if (selectedStatus === TaskStatus.NEW) {
      return "No new tasks.";
    } else if (selectedStatus === TaskStatus.IN_PROGRESS) {
      return "No in-progress tasks.";
    } else if (selectedStatus === TaskStatus.DONE) {
      return "No done tasks.";
    } else {
      return "No tasks.";
    }
  };

  const openModal = (mode: TaskFormMode, taskId?: string) => {
    setFormMode(mode);
    if (mode === TaskFormMode.UPDATE && taskId) {
      const existingTaskToEdit = tasksList.find((task) => task._id === taskId);
      if (existingTaskToEdit) {
        setTask({
          ...existingTaskToEdit,
        });
      }
    } else {
      setTask(initialData);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading?.(true);
    try {
      const data = await createTask(task);
      setTasksList?.([...(tasksList || []), data]);
      setLoading?.(false);
      setTask(initialData);
    } catch (err) {
      setLoading?.(false);
      console.error("Failed to create a new task.", err);
    }
  };

  const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Destructure newTask to get properties
    const { _id, name, content, startDate, endDate, category } = task;

    const existingTaskToEdit = {
      _id,
      name,
      content,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
      categoryName: category.categoryName,
    };

    setLoading?.(true);

    try {
      const data = await editTask(_id, existingTaskToEdit);
      setTasksList((prev) =>
        prev.map((task) => (task._id === _id ? data : task)),
      );
      setLoading?.(false);
    } catch (err) {
      setLoading?.(false);
      console.error("Failed to update task.", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (confirmDelete) {
      try {
        await deleteTask(taskId);
        const updatedTasks = tasksList.filter((task) => task._id !== taskId);
        setTasksList(updatedTasks);
        setIsModalOpen(false);
        alert("Task deleted successfully!");
      } catch (err) {
        console.error("Failed to delete task.", err);
        alert("Failed to delete task.");
      }
    }
  };

  return (
    <>
      <TasksViewHeader
        searchTaskName={searchTaskName}
        selectedStatus={selectedStatus}
        task={task}
        onSetTask={setTask}
        onSetTasksList={setTasksList}
        onSearchTaskName={setSearchTaskName}
        onSelectedStatus={setSelectedStatus}
        onOpenTaskModal={openModal}
        onFetchPagedTasks={fetchPagedTasks}
      />
      {isModalOpen && (
        <TaskModal
          onClose={closeModal}
          onSubmit={
            formMode === TaskFormMode.CREATE ? handleCreateTask : handleEditTask
          }
          mode={formMode}
          task={task}
          setTask={setTask}
          tasksList={tasksList}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {tasksList.length ? (
        <TasksList
          loading={loading}
          error={error}
          selectedStatus={selectedStatus}
          tasksList={tasksList}
          onSelectedStatus={setSelectedStatus}
          onDeleteTask={handleDeleteTask}
          onOpenTaskModal={(mode, taskId) => openModal(mode, taskId)}
        />
      ) : (
        <div className="flex items-center justify-center mt-4">
          <p>{renderNoTasksMessage()}</p>
        </div>
      )}

      {/* Pagination controls */}
      <div className="fixed bottom-3 right-3 md:right-10 flex items-center gap-4 bg-white h-10 p-2 rounded-lg shadow-lg max-w-max">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-black border-white hover:bg-white hover:text-black"
        >
          <img src={previousArrow} alt="back arrow" width={18} />
        </button>
        <span className="text-black text-md">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-black border-white hover:bg-white hover:text-black"
        >
          <img src={nextArrow} alt="next arrow" width={18} />
        </button>
      </div>
    </>
  );
};

export default Tasks;
