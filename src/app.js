import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./docs/swagger.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import limiter from "./middleware/rateLimit.middleware.js";
import notFound from "./middleware/notFound.middleware.js";

const app = express();

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(limiter)

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API Running",
  });
});

app.use(notFound);

app.use(errorHandler);

export default app;