import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rootRoutes from "./routes/root.js";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger, logEvents } from "./middleware/logger.js";
import { connectDB } from "./config/dbConn.js";
import cookieParser from "cookie-parser";
import path from "path";
import User from "./models/User.js";
import { dataUser } from "./data/index.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();
mongoose.set("debug", false); // Disable Mongoose debugging output

app.use(logger);

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

/* ROUTES */
app.use("/", rootRoutes);
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
app.use(errorHandler);

// Connect to MongoDB
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Only run once to insert data to database

  //User.insertMany(dataUser);
});

mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
