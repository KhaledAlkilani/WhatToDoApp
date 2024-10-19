import { Router } from "express";
import { sayHello } from "../constrollers/helloController";

const helloRoute = Router();

helloRoute.get("/", sayHello);

export default helloRoute;
