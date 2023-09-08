require("dotenv").config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const errorHandler = require("./middleware/errorHandler");
const { logger, logEvents } = require("./middleware/logger");

const morgan = require("morgan");
const helmet = require("helmet");

const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

const PORT = process.env.PORT || 3500;

connectDB();

console.log(process.env.NODE_ENV);

app.use(logger);

/* CONFIGURATION */
app.use(cors());

app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));

/* ROUTES */
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/general", require("./routes/generalRoutes"));
app.use("/employees", require("./routes/employeeRoutes"));
app.use("/sales", require("./routes/salesRoutes"));
app.use("/management", require("./routes/managementRoutes"));

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

/* MONGOOSE SETUP */

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
