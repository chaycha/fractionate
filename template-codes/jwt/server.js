// Make .env works
require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

// Make the app use json body
app.use(express.json());

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

// Only show posts that match the username
app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

// Middleware to authenticate the token
function authenticateToken(req, res, next) {
  // Get the token from the header
  // authHeader will be in format "Bearer <token>"
  const authHeader = req.headers["authorization"];
  // Get the token from the Bearer
  const token = authHeader && authHeader.split(" ")[1];

  // If no token, send 401 (unauthorized)
  if (token == null) return res.sendStatus(401);

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // If token is invalid (wrong user), send 403 (forbidden)
    if (err) return res.sendStatus(403);
    // If token is valid, decode "user" from token and make it accessible to the next middleware
    req.user = user;
    // Go to the next middleware
    next();
  });
}

app.listen(3000);
