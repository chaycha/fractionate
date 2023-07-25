// Scripts for deploying RealEstateTokens
// To specify network, use --network flag when running the script
const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // for hardhat network, deployer is always Account #0 (0xf39...)
  // for Sepolia testnet, deployer is defined by RPC URL and private key in "networks" section of hardhat.config.js
  // for metamask, deployer is the connected wallet address

  console.log("Deploying contracts with the account:", deployer.address);

  const contract = await hre.ethers.deployContract("RealEstateTokens");

  console.log("Tokens contract address:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
