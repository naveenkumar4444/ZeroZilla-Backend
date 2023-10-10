const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 8000;

dotenv.config();

app.use(express.json({ limit: "4mb" }));
app.use(cors());

const AgencyRoutes = require("./routes/Agency");
const ClientRoutes = require("./routes/Client");
const UserRoutes = require("./routes/User");
const ErrorMiddleWare = require("./middlewares/ErrorMiddleWare");
const { verifyToken } = require("./middlewares/Auth");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("Error in connection");
  });

app.use("/agency", verifyToken, AgencyRoutes);
app.use("/client", verifyToken, ClientRoutes);
app.use("/user", UserRoutes);

// app.use(function (error, req, res, next) {
//   const status = error.status || 500;
//   const message = error.message || "Something Went Wrong";
//   res.status(status).send({
//     status,
//     message,
//   });
// });

app.use(ErrorMiddleWare);

app.listen(PORT, () => {
  console.log("Running on port ", PORT);
});
