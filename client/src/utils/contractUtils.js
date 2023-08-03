import { ethers } from "ethers";

export async function getTokenContract(abi) {
  const metamaskProvider = new ethers.BrowserProvider(window.ethereum);
  const signer = await metamaskProvider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS,
    abi,
    metamaskProvider
  );
  if (!contract) {
    console.log("Could not get contract");
    return;
  }
  // note that the connect() function is NECESSARY here, without it you'll get an error "Contract runner does not support sending transactions"
  // when this line is executed, a metamask popup will appear asking for your confirmation to sign the transaction
  const connectedContract = contract.connect(signer);
  return connectedContract;
}

export async function getDaoContract(abi) {
  const metamaskProvider = new ethers.BrowserProvider(window.ethereum);
  const signer = await metamaskProvider.getSigner();
  const contract = new ethers.Contract(
    process.env.REACT_APP_DAO_CONTRACT_ADDRESS,
    abi,
    metamaskProvider
  );
  if (!contract) {
    console.log("Could not get contract");
    return;
  }
  const connectedContract = contract.connect(signer);
  return connectedContract;
}
