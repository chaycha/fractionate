require("dotenv").config();
const hre = require("hardhat");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");

// custom middleware
// for use with routes that require authentication (taken from /posts example)
function authenticateToken(req, res, next) {
  if (req.cookies?.jwt) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;

    // Check if refresh token exists
    if (refreshToken == null) return res.sendStatus(401);

    // Verify refresh token using jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
}

// use middleware
router.use(cookieparser());
router.use(authenticateToken);

// Create a new token
// Contract deployer pays for minting fee
router.post("/", async (req, res) => {
  const contract = await hre.ethers.getContractAt(
    "RealEstateTokens",
    process.env.DEPLOYED_CONTRACT_ADDRESS
  );
  const { assetName, assetPrice, minerAddress } = req.body;
  const pricePerToken = assetPrice / process.env.TOKEN_AMOUNT;
  //await contract.mint(minerAddress, 5, process.env.TOKEN_AMOUNT, "0x");
  await contract.mintNew(
    assetName,
    process.env.TOKEN_AMOUNT,
    pricePerToken,
    minerAddress
  );
  console.log(await contract.balanceOf(minerAddress, 5));
  res.json({ message: "Tokenise success" });
});

module.exports = router;
