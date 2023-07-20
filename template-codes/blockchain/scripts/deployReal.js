async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(deployer.address);
  // for hardhat network, deployer is always Account #0 (0xf39...)
  // for metamask, deployer is the connected wallet address

  console.log("Deploying contracts with the account:", deployer.address);

  const contract = await ethers.deployContract("RealEstateTokens");

  console.log("Tokens contract address:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
