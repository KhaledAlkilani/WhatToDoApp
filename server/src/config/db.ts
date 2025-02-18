import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const options = {
  autoIndex: false,
  maxPoolSize: 10,
};

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/WhatToDoDB";

let retryCount = 0;

const connectWithRetry = () => {
  mongoose
    .connect(uri, options)
    .then(() => {
      console.log("MongoDB is connected");
      retryCount = 0;
    })
    .catch((err) => {
      retryCount += 1;
      console.log(
        `MongoDB connection unsuccessful, retry after ${
          2 * retryCount
        } seconds.`,
        err,
      );
      setTimeout(connectWithRetry, 2000 * retryCount);
    });
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection lost. Retrying...");
  connectWithRetry();
});

export default connectWithRetry;
