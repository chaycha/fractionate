import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";

export const ProtectedLayout = () => {
  const { user, logout } = useAuth();
  const outlet = useOutlet();

  // If not logged in, navigate to home page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If user switch metamask wallet, log the user out
  // `accountsChanged` event can be triggered with an undefined newAddress.
  // This can also happen when the user removes the Dapp from the "Connected
  // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
  const handleAccountChange = ([newAddress]) => {
    console.log(user);
    if (newAddress !== user.walletAddress) {
      alert(
        "Wallet change detected. You will now be logged out. Please log in again while connecting to the registered MetaMask wallet"
      );
      logout();
    }
  };

  window.ethereum.removeListener("accountsChanged", handleAccountChange); // Remove previous listener, if any
  window.ethereum.on("accountsChanged", handleAccountChange); // Register the updated listener

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
