"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const options = {
    autoIndex: false,
    maxPoolSize: 10,
};
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/WhatToDoDB";
let retryCount = 0;
const connectWithRetry = () => {
    mongoose_1.default
        .connect(uri, options)
        .then(() => {
        console.log("MongoDB is connected");
        retryCount = 0;
    })
        .catch((err) => {
        retryCount += 1;
        console.log(`MongoDB connection unsuccessful, retry after ${2 * retryCount} seconds.`, err);
        setTimeout(connectWithRetry, 2000 * retryCount);
    });
};
mongoose_1.default.connection.on("disconnected", () => {
    console.log("MongoDB connection lost. Retrying...");
    connectWithRetry();
});
exports.default = connectWithRetry;
