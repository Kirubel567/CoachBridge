import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.config";
import fs from "fs";
import path from "path";
import { HTTP_STATUS } from "./config/constants";

const tmpDir = path.join(process.cwd(), "tmp");

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const nodeEnv = process.env.NODE_ENV || "development";

if (nodeEnv === "development") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else if (nodeEnv !== "development") {
  app.get("/api-docs", (req, res) => {
    res.json({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "UNAUTHORIZED ACESS!",
    });
  });
}

app.use("/api/v1", routes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use(notFound);
app.use(errorHandler);

export default app;
