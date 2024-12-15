import { useEffect, useState } from "react";
import { Task, TaskFormMode, TaskStatus } from "../../models/TaskModels";
import TasksList from "./TasksList";
import {
  createTask,
  deleteTask,
  editTask,
  getTasks,
  getTasksWithPagination,
  searchTasksByName,
} from "../../services/apiService";
import { getTaskStatus } from "../../utils";
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
  const [searchedTasks, setSearchedTasks] = useState<Task[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const debouncedSearchTaskName = useSearchDebounce(searchTaskName, 500); // Debounce the search input by 500ms

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then((data) => {
        setTasksList(data);
        setLoading(false);
      })

      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    handleSearchTasks();
  }, [debouncedSearchTaskName]);

  // Fetch tasks whenever currentPage changes
  useEffect(() => {
    fetchPagedTasks(currentPage);
  }, [currentPage]);

  // Fetch tasks whenever currentPage changes
  const fetchPagedTasks = async (page: number) => {
    setLoading(true);
    try {
      const data = await getTasksWithPagination(page);
      setTasksList(data.tasks);
      setTotalPages(data.pagination.totalPages);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch tasks");
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchTasks = async () => {
    if (debouncedSearchTaskName.trim() === "") {
      setSearchedTasks(null);
      return;
    }
    try {
      const searchedTasks = await searchTasksByName(debouncedSearchTaskName);
      setSearchedTasks(searchedTasks);
    } catch (err) {
      console.error("Error fetching searched tasks.", err);
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
    const { _id, name, content, startDate, endDate } = task;

    const existingTaskToEdit = {
      _id,
      name,
      content,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
    };

    setLoading?.(true);

    try {
      const data = await editTask(_id, existingTaskToEdit);
      setTasksList((prev) =>
        prev.map((task) => (task._id === _id ? data : task))
      );
      setLoading?.(false);
    } catch (err) {
      setLoading?.(false);
      console.error("Failed to update task.", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      try {
        await deleteTask(taskId);

        const updatedTasks = tasksList.filter((task) => task._id !== taskId);
        setTasksList(updatedTasks);

        alert("Task deleted successfully!");
      } catch (err) {
        console.error("Failed to delete task.", err);
        alert("Failed to delete task.");
      }
    }
  };

  const filteredTasks =
    selectedStatus === null
      ? tasksList
      : tasksList.filter((task) => getTaskStatus(task) === selectedStatus);

  return (
    <>
      <TasksViewHeader
        searchTaskName={searchTaskName}
        selectedStatus={selectedStatus}
        task={task}
        tasksList={tasksList}
        onSetTask={setTask}
        onTasksList={setTasksList}
        onSearchTaskName={setSearchTaskName}
        onSelectedStatus={setSelectedStatus}
        onOpenTaskModal={openModal}
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
        />
      )}

      {filteredTasks.length ? (
        <TasksList
          searchedTasks={searchedTasks}
          loading={loading}
          error={error}
          selectedStatus={selectedStatus}
          tasksList={filteredTasks}
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
      <div className="absolute bottom-3 right-10 flex items-center gap-4 bg-white h-10 p-2 rounded-lg shadow-lg max-w-max">
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
