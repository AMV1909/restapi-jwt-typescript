import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";

import { routes } from "./routes/router/router.routes";

const app: Application = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(routes.auth);

export { app };
