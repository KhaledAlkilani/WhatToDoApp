"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helloController_1 = require("../controllers/helloController");
const helloRoute = (0, express_1.Router)();
helloRoute.get("/", helloController_1.sayHello);
exports.default = helloRoute;
