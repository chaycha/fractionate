import { BasicPage } from "../components/BasicPage";
import Person from "@mui/icons-material/Person";
//import { Button } from "@mui/material";
import { useLocalStorage } from "../hooks/useLocalStorage";
//import { useState } from "react";

export const ProfilePage = () => {
  /*
  const [selectedAddress, setSelectedAddress] = useState();
  const connectWallet = async () => {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    // First we check the network
    checkNetwork();

    initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return resetState();
      }

      initialize(newAddress);
    });
  };

  function initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    setSelectedAddress(userAddress);

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    initializeEthers();
    getTokenData();
    startPollingData();
  }

  const HARDHAT_NETWORK_ID = "31337";

  // This method checks if the selected network is Localhost:8545
  function checkNetwork() {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      switchChain();
    }
  }

  function stopPollingData() {
    clearInterval(pollDataInterval);
    pollDataInterval = undefined;
  }

  function resetState() {
    setState(initialState);
  }

  const initializeEthers = async () => {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  };

  const getTokenData = async () => {
    const name = await this._token.name();
    const symbol = await this._token.symbol();

    this.setState({ tokenData: { name, symbol } });
  };

  const startPollingData = () => {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  };

  const switchChain = async () => {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`;
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this._initialize(this.state.selectedAddress);
  };
*/
  const [user] = useLocalStorage("user", {}); // Access user data stored in local storage
  const title = `${user.email}'s Profile Page`; // get the user email from the user object
  return (
    <>
      <BasicPage title={title} icon={<Person />}></BasicPage>
    </>
  );
};
