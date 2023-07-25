require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("./db");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const { db, sql } = require("@vercel/postgres");

// use middleware;
router.use(cookieparser());

// custom middleware
// for use with routes that require authentication (taken from /posts example)
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//ROUTES//

// Sign up a new user
router.post("/signup", async (req, res) => {
  try {
    // req.body is a JSON body (payload) of the HTTP request
    const { name, email, walletAddress, password } = req.body;

    // make a new row with email and password
    // Uncomment this section if you want to use local PostgresQL database
    /*
    const newUser = await pool.query(
      "INSERT INTO user_list (name, email, password, linked_wallet) VALUES($1, $2, $3, $4) RETURNING *",
      [name, email, password, walletAddress]
    );
    */
    // Uncomment this section if you want to use Vercel Postgres (require setting up environment variables for connection)
    const newUser =
      await sql`INSERT INTO user_list (name, email, password, linked_wallet) VALUES(${name}, ${email}, ${password}, ${walletAddress}) RETURNING *;`;

    res.json(newUser.rows[0]);
    console.log("New user created");
  } catch (err) {
    console.error(err.message);
  }
});

// Sign in mechanism
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Uncomment this section if you want to use local PostgresQL database
    /*
    const matchedUsers = await pool.query(
      "SELECT * FROM user_list WHERE email = $1 AND password = $2",
      [email, password]
    );
    */
    // Uncomment this section if you want to use Vercel Postgres (require setting up environment variables for connection)
    const matchedUsers =
      await sql`SELECT * FROM user_list WHERE email = ${email} AND password = ${password};`;

    // If the email and password are correct, then matchedUsers.rows.length = 1
    // Otherwise, matchedUsers.rows.length = 0
    if (matchedUsers.rows.length === 1) {
      const accessToken = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { email: email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "20m" }
      );

      // Assigning refresh token in http-only cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      console.log("Sign in successfully");
      return res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        email: matchedUsers.rows[0].email,
        linkedWallet: matchedUsers.rows[0].linked_wallet,
      });
    } else {
      // send status 401 (unauthorized) to the client
      res.sendStatus(401);
      console.log("Wrong email or password");
    }
  } catch (err) {
    console.error(err.message);
  }
});

// For requesting a new access token when the user already logged in but the old access token is expired
// Request body not needed, jwt is stored in cookie
router.post("/refresh", (req, res) => {
  if (req.cookies?.jwt) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;

    // Check if refresh token is valid
    if (refreshToken == null) return res.sendStatus(401);
    //if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    // Verify refresh token using jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      // Generate new access token
      const accessToken = jwt.sign(
        { email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      res.json({ accessToken: accessToken });
    });
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
});

// Log out by deleting cookie
// Note that jwt.verify() is not needed here (no need to check if the token is valid)
router.delete("/logout", (req, res) => {
  console.log("Log out successfully");
  res.clearCookie("jwt");
  res.sendStatus(204);
});

module.exports = router;
