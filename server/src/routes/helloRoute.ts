import { Router } from "express";
import { sayHello } from "../controllers/helloController";

const helloRoute = Router();

helloRoute.get("/", sayHello);

export default helloRoute;
