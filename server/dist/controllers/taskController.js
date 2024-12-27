"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksWithPagination = exports.getTasksByDateRange = exports.searchTasksByName = exports.deleteTask = exports.editTask = exports.createTask = exports.getTasks = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel "));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield taskModel_1.default.find();
        res.status(200).json(tasks);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Couldn't get tasks from the db", error: err.message });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, content, startDate, endDate } = req.body;
        const newTask = new taskModel_1.default({
            name,
            content,
            startDate,
            endDate,
        });
        yield newTask.save();
        res.status(200).json(newTask);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Failed to create task", error: err.message });
    }
});
exports.createTask = createTask;
const editTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, content, startDate, endDate } = req.body;
        const taskId = req.params.id;
        const updatedTask = yield taskModel_1.default.findByIdAndUpdate(taskId, { name, content, startDate, endDate }, { new: true });
        if (!updatedTask) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.status(200).json(updatedTask);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "failed to edit task", error: err.message });
    }
});
exports.editTask = editTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.id;
        const taskToDelete = yield taskModel_1.default.findByIdAndDelete(taskId);
        if (!taskToDelete) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Failed to delete task", error: err.message });
    }
});
exports.deleteTask = deleteTask;
// Search tasks by name
const searchTasksByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        if (!name || typeof name !== "string") {
            res.status(400).json({
                error: "Name query parameter is required and must be a string",
            });
            return;
        }
        // Find tasks matching the name (case-insensitive)
        const tasks = yield taskModel_1.default.find({
            name: { $regex: new RegExp(name, "i") }, // Case-insensitive search using regex
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error("Error in getSearchByName:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.searchTasksByName = searchTasksByName;
// Filter tasks by date range
const getTasksByDateRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        res.status(400).json({ error: "Start date and end date are required" });
        return;
    }
    try {
        const tasks = yield taskModel_1.default.find({
            startDate: { $gte: new Date(startDate) },
            endDate: { $lte: new Date(endDate) },
        });
        res.status(200).json(tasks);
    }
    catch (err) {
        console.error("Error fetching tasks by date range:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getTasksByDateRange = getTasksByDateRange;
// Pagination function
const getTasksWithPagination = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Assuming Task is a model and this is a mongoose query or equivalent
        const tasks = yield taskModel_1.default.find().skip(skip).limit(limit);
        const totalCount = yield taskModel_1.default.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);
        return res.status(200).json({
            tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to retrieve tasks" });
    }
});
exports.getTasksWithPagination = getTasksWithPagination;
