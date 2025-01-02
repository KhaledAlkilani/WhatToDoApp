import { Request, Response } from "express";
import Task, { TaskStatus } from "../models/taskModel ";
import Category from "../models/categoryModel";
import { TaskCategoryPopulateSelect } from "./categoryController";

export const createTask = async (req: Request, res: Response) => {
  const { name, content, startDate, endDate, categoryName } = req.body;
  try {
    // Find the category now that it's created or fetched
    let category = await Category.findOne({ categoryName });

    if (!category) {
      // If the category doesn't exist, create a new category
      category = new Category({ categoryName });
      await category.save(); // Save the new category to the database
    }

    // Determine the initial status based on dates
    const currentDate = new Date();
    let status: TaskStatus;

    if (startDate && new Date(startDate) > currentDate) {
      status = TaskStatus.NEW;
    } else if (endDate && new Date(endDate) < currentDate) {
      status = TaskStatus.DONE;
    } else {
      status = TaskStatus.IN_PROGRESS;
    }

    const newTask = new Task({
      name,
      content,
      startDate,
      endDate,
      status,
      category: category._id,
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate(
      TaskCategoryPopulateSelect.CATEGORY
    );
    res.status(200).json(populatedTask);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to create task", error: err.message });
  }
};

export const editTask = async (req: Request, res: Response) => {
  const { name, content, startDate, endDate, categoryName } = req.body;
  const taskId = req.params.id;

  try {
    // Find the category (create it if it doesn't exist)
    let category = await Category.findOne({ categoryName });

    if (!category) {
      // If the category doesn't exist, create a new category
      category = new Category({ categoryName });
      await category.save();
    }

    // Determine the status based on dates
    const currentDate = new Date();
    let status: TaskStatus;

    if (startDate && new Date(startDate) > currentDate) {
      status = TaskStatus.NEW;
    } else if (endDate && new Date(endDate) < currentDate) {
      status = TaskStatus.DONE;
    } else {
      status = TaskStatus.IN_PROGRESS;
    }

    // Update and populate in one operation
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        name,
        content,
        startDate,
        endDate,
        status, // Add the calculated status
        category: category._id,
      },
      { new: true }
    ).populate(TaskCategoryPopulateSelect.CATEGORY);

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err: any) {
    res.status(500).json({
      message: "Failed to edit task",
      error: err.message,
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    const taskToDelete = await Task.findByIdAndDelete(taskId);

    if (!taskToDelete) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};

// Search tasks by name
export const searchTasksByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      res.status(400).json({
        error: "Name query parameter is required and must be a string",
      });
      return;
    }

    // Find tasks matching the name (case-insensitive)
    const tasks = await Task.find({
      name: { $regex: new RegExp(name, "i") }, // Case-insensitive search using regex
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getSearchByName:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Filter tasks by date range
export const getTasksByDateRange = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({ error: "Start date and end date are required" });
    return;
  }

  try {
    const tasks = await Task.find({
      startDate: { $gte: new Date(startDate as string) },
      endDate: { $lte: new Date(endDate as string) },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by date range:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTasksWithPagination = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 20;
    const skip: number = (page - 1) * limit;

    const status: TaskStatus | undefined = req.query.status as
      | TaskStatus
      | undefined;
    const search: string | undefined = req.query.search as string | undefined;

    // Build the aggregation pipeline
    const pipeline: any[] = [
      // First stage: Join with categories collection
      {
        $lookup: {
          from: "Categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      // Unwind the category array created by lookup
      {
        $unwind: "$categoryData",
      },
    ];

    // Add search stage if search term is provided
    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            {
              "categoryData.categoryName": {
                $regex: searchTerm,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    // Add status filter if provided
    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      pipeline.push({
        $match: { status: status },
      });
    }

    // Add pagination stages
    const paginationPipeline = [
      // Get total count before pagination
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limit },
            // Reshape the document to match your existing response format
            {
              $project: {
                _id: 1,
                name: 1,
                content: 1,
                startDate: 1,
                endDate: 1,
                status: 1,
                category: "$categoryData",
              },
            },
          ],
        },
      },
    ];

    const finalPipeline = [...pipeline, ...paginationPipeline];

    // Execute the aggregation
    const [result] = await Task.aggregate(finalPipeline);

    const totalCount = result.metadata[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      tasks: result.data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (err) {
    console.error("Error fetching tasks with pagination:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
