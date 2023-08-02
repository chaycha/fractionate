import { useEffect, useCallback } from "react";
import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";

export const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const outlet = useOutlet();

  // Function to handle account change
  const handleAccountChange = useCallback(
    ([newAddress]) => {
      console.log(user);
      if (newAddress !== user.walletAddress) {
        alert(
          "Wallet change detected. You will now be logged out. Please log in again while connecting to the registered MetaMask wallet"
        );
        logout();
      }
    },
    [user, logout]
  );

  // Function to handle network change
  const handleNetworkChange = useCallback(
    (newNetwork) => {
      const sepoliaChainId = "0xaa36a7"; // Chain ID for Sepolia
      if (newNetwork.toLowerCase() !== sepoliaChainId) {
        alert(
          "Network change detected. You will now be logged out. Please switch to the Sepolia testnet and log in again."
        );
        logout();
      }
    },
    [logout]
  );

  // If user switch metamask wallet, log the user out
  // This can also happen when the user removes the Dapp from the "Connected
  // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
  useEffect(() => {
    window.ethereum.on("accountsChanged", handleAccountChange); // Register the updated listener
    window.ethereum.on("chainChanged", handleNetworkChange); // Register the network change listener
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange); // Deregister the listener
      window.ethereum.removeListener("chainChanged", handleNetworkChange); // Deregister the network change listener
    };
  }, [handleAccountChange, handleNetworkChange]);

  // If not logged in, navigate to home page
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <AppBar
        leftPages={[
          { label: "My Assets", path: "my-assets" },
          { label: "Submit Assets", path: "submit-assets" },
          { label: "Transfer", path: "transfer" },
        ]}
        rightPages={[
          { label: "Profile", path: "profile" },
          { label: "Settings", path: "settings" },
        ]}
      />
      {outlet}
    </div>
  );
};
