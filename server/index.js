require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// middleware
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Check if the request origin is allowed (correct CLIENT_URL)
      const isAllowed = origin === process.env.CLIENT_URL;
      callback(null, isAllowed);
    },
  })
);
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");

// use routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("If you can see this message, the server is running.");
});

app.listen(4000, () => {
  console.log("server is listening on port 4000...");
});

module.exports = app;
