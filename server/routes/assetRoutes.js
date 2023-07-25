require("dotenv").config();
const ethers = require("ethers");
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
router.post("/new-asset", async (req, res) => {
  try {
    // Provider to connect to Sepolia from Alchemy
    const sepoliaProvider = new ethers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL
    );
    // Fractionate admin pays for all fees
    const fractionateAdmin = new ethers.Wallet(
      process.env.ADMIN_PRIVATE_KEY,
      sepoliaProvider
    );
    const contract = new ethers.Contract(
      process.env.DEPLOYED_SEPOLIA_CONTRACT_ADDRESS,
      [
        "function mintNew(string memory name, uint256 totalSupply, uint256 pricePerToken, address minerAddress) public",
      ],
      sepoliaProvider
    );
    // if error could not get contract
    if (!contract) {
      return res.status(500).json({ message: "Could not get contract" });
    }
    const { assetName, assetPrice, minerAddress } = req.body;
    const pricePerToken = Math.floor(
      (assetPrice * process.env.MULTIPLIER) / process.env.TOKEN_AMOUNT
    );
    // connect to admin (who will pay for minting fee) before minting
    await contract
      .connect(fractionateAdmin)
      .mintNew(
        assetName,
        process.env.TOKEN_AMOUNT,
        pricePerToken,
        minerAddress
      );
    console.log(
      `Tokenise asset successfully. Name:${assetName}, Amount:${process.env.TOKEN_AMOUNT} Price:${pricePerToken}, Miner:${minerAddress}`
    );
    res.status(200).json({ message: "Tokenise success", token: assetName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Tokenise failed" });
  }
});

// create a route to serve getAsset
router.post("/my-assets", async (req, res) => {
  try {
    // Provider to connect to Sepolia from Alchemy
    const sepoliaProvider = new ethers.JsonRpcProvider(
      process.env.SEPOLIA_RPC_URL
    );
    // Fractionate admin pays for all fees
    const fractionateAdmin = new ethers.Wallet(
      process.env.ADMIN_PRIVATE_KEY,
      sepoliaProvider
    );
    const contract = new ethers.Contract(
      process.env.DEPLOYED_SEPOLIA_CONTRACT_ADDRESS,
      [
        "function getTokensOfUser(address account) public view returns (tuple(uint256 id, string name, uint256 pricePerToken, uint256 balance)[] memory)",
      ],
      sepoliaProvider
    );
    // if error could not get contract
    if (!contract) {
      return res.status(500).json({ message: "Could not get contract" });
    }
    const { userAddress } = req.body;
    const ownedTokenList = await contract
      .connect(fractionateAdmin)
      .getTokensOfUser(userAddress);
    const formattedOwnedTokenList = ownedTokenList.map((userTokenData) => {
      return {
        id: Number(userTokenData.id), // Assuming id is a Big Number, converting it to a Number
        name: userTokenData.name, // Assuming name is a regular property (string, etc.)
        pricePerToken: Number(userTokenData.pricePerToken), // Converting pricePerToken to a Number
        balance: Number(userTokenData.balance), // Converting balance to a Number
      };
    });
    console.log(
      "Retrieved token list from blockchain successfully",
      formattedOwnedTokenList
    );
    res.status(200).json({
      message: "Get assets success",
      ownedTokenList: formattedOwnedTokenList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Get assets failed" });
  }
});

module.exports = router;
