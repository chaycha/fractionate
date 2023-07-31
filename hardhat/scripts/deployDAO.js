// Scripts for deploying RealEstateDAO only using the existing RealEstateTokens contract address
// To specify network, use --network flag when running the script
// IMPORTANT: After each re-deployment, update both contract addresses in client/.env and server/.env
const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // for hardhat network, deployer is always Account #0 (0xf39...)
  // for Sepolia testnet, deployer is defined by RPC URL and private key in "networks" section of hardhat.config.js
  // for metamask, deployer is the connected wallet address

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy RealEstateDAO.sol
  const tokenContractAddress = "0xc6898a0bDfC41A71Dc8bf8EdEEE0FC4680e0C68A";
  const DAOContract = await hre.ethers.deployContract("RealEstateDAO", [
    tokenContractAddress,
  ]);
  const DAOContractAddress = await DAOContract.getAddress();
  console.log("RealEstateDAO contract address:", DAOContractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
