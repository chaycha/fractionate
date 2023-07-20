const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const newAssetRoutes = require("./routes/newAssetRoutes");

// use routes
app.use("/auth", authRoutes);
app.use("/new-asset", newAssetRoutes);

app.listen(4000, () => {
  console.log("server is listening on port 4000...");
});
