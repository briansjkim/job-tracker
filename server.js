import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import { connectDB } from "./db/connect.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// middleware
import { notFoundMiddleware } from "./middleware/not-found.js";
import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import morgan from "morgan";

// routes
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

// security
import helmet from "helmet"; // helps secure Express apps by setting various hTTP headers
import xss from "xss-clean"; // Sanitize user input coming from POST body, GET queries, and URL params
import mongoSanitize from "express-mongo-sanitize"; // sanitizes user-supplied data to prevent MongoDB operator injection
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "prod") {
  app.use(morgan("dev"));
}

// since we have POST requests, we want to accept JSON which express.json() allows
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// app.get("/", (req, res) => {
//   res.send("Welcome!");
// });

// app.get("/api/v1", (req, res) => {
//   res.send("Welcome!");
// });

// this syntax is slightly different from the usual setup because we're using ES6 modules rather than CommonJS
// because we're using es6 modules, we need to use import.meta.url to get the __dirname since it's not available by default like it in CommonJS
const __dirname = dirname(fileURLToPath(import.meta.url));

// ** only use when deployment is ready
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    const conn = await connectDB(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
