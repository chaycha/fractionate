const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const newAssetRoutes = require("./routes/assetRoutes");

// use routes
app.use("/auth", authRoutes);
app.use("/asset", newAssetRoutes);

app.get("/", (req, res) => {
  res.send("Hello World1!");
});
app.listen(4000, () => {
  console.log("server is listening on port 4000...");
});

module.exports = app;
