"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helloRoute_1 = __importDefault(require("./routes/helloRoute"));
const taskRoute_1 = __importDefault(require("./routes/taskRoute"));
const db_1 = __importDefault(require("./config/db"));
exports.app = (0, express_1.default)();
const clientURL = "http://localhost:5173";
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: clientURL,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
exports.app.use("/", helloRoute_1.default);
exports.app.use("/api", taskRoute_1.default);
// WhatToDoDB connection function
(0, db_1.default)();
exports.default = exports.app;
