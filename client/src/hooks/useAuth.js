import { createContext, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();
const apiUrl = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children, userData }) => {
  // Using custom useLocalStorage hook to store user data in local storage
  // under the key "user"
  // the  data stored is only user's email in the format { email: <user's email> }
  const [user, setUser] = useLocalStorage("user", userData);
  const navigate = useNavigate();

  // login function
  const login = useCallback(
    async (payload) => {
      try {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
          }),
        });
        if (response.status === 401) {
          alert("Email or password is incorrect");
          return;
        }
        const receivedResponse = await response.json();

        // The code below enforce the "1 user - 1 wallet - Sepolia only" policy
        // Sepolia testnet details
        const sepolia = {
          chainId: "0xaa36a7",
          chainName: "Sepolia (Fractionate)",
          nativeCurrency: {
            name: "SepoliaETH",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: [process.env.REACT_APP_SEPOLIA_RPC_URL],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        };
        // Check if the current network is Sepolia
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (currentChainId.toLowerCase() !== sepolia.chainId) {
          // If not, add and switch to Sepolia network
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [sepolia],
          });
        }
        // Connect to metamask, and check if the wallet address matches the one used to register
        const [obtainedAddress] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // If current metamask address does not match the one used to register, not allowed to log in.
        if (receivedResponse.linkedWallet.toLowerCase() !== obtainedAddress) {
          alert(
            "Wallet address does not match. Please switch to the Metamask wallet used to registered with Fractionate before logging in again."
          );
          return;
        }

        console.log("Logged in successfully:", receivedResponse);
        navigate("/dashboard/my-assets", { replace: true });
        setUser({
          email: receivedResponse.email,
          linkedWallet: receivedResponse.linkedWallet,
        });
      } catch (err) {
        console.error(err.message);
      }
    },
    [navigate, setUser]
  );

  // logout function
  // when executed, it sends a request to the server to delete the refresh token and removes the "jwt" cookie
  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Logged out successfully");
        navigate("/", { replace: true });
        setUser(null);
      } else {
        console.error("Logout request failed:", response.status);
      }
    } catch (err) {
      console.error(err.message);
    }
  }, [setUser, navigate]);

  // signup function
  const signup = useCallback(
    async (payload) => {
      try {
        const response = await fetch(`${apiUrl}/auth/signup`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            walletAddress: payload.walletAddress,
            password: payload.password,
          }),
        });
        if (!response.ok) {
          console.error("Sign up request failed:", response.status);
          return;
        }
        const receivedResponse = await response.json();
        console.log("Sign up successfully", receivedResponse);
        alert("Signed up successfully.");
        navigate("/dashboard/my-assets", { replace: true });
        setUser({
          email: receivedResponse.email,
          linkedWallet: receivedResponse.linkedWallet,
        });
      } catch (err) {
        console.error(err.message);
      }
    },
    [navigate, setUser]
  );

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      signup,
    }),
    [user, login, logout, signup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
