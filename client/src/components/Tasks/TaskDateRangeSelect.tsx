import { Task } from "../../models/TaskModels";

interface TaskDateRangeSelectProps {
  task?: Task;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectDateRange: () => void;
  onResetDateRange: () => Promise<void>;
}

const TaskDateRangeSelect = ({
  task,
  onStartDateChange,
  onEndDateChange,
  onSelectDateRange,
  onResetDateRange,
}: TaskDateRangeSelectProps) => {
  return (
    <>
      <div className="px-4 py-2 text-sm">
        <label className="block mb-2">Start Date</label>
        <input
          type="date"
          value={
            task?.startDate
              ? new Date(task.startDate).toISOString().split("T")[0]
              : ""
          }
          onChange={onStartDateChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="px-4 py-2 text-sm">
        <label className="block mb-2">End Date</label>
        <input
          type="date"
          value={
            task?.endDate
              ? new Date(task.endDate).toISOString().split("T")[0]
              : ""
          }
          onChange={onEndDateChange}
          className="input input-bordered w-full"
        />
      </div>
      <div className="px-4 py-2 text-sm flex justify-between">
        <button
          onClick={onSelectDateRange}
          className="btn btn-primary text-white px-4 py-2 rounded-md"
        >
          Apply
        </button>
        <button
          onClick={onResetDateRange}
          className="btn border-2 text-red-500 px-4 py-2 rounded-md"
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default TaskDateRangeSelect;
