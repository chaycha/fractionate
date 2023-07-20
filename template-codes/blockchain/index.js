const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./database/authRoutes");

// use routes
app.use("/db/auth", authRoutes);

app.listen(4000, () => {
  console.log("server is listening on port 4000...");
});
