import { createContext, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

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
        const response = await fetch("/login", {
          method: "POST",
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
        console.log(receivedResponse);
        navigate("/dashboard/profile", { replace: true });
        setUser({ email: payload.email });
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
      const response = await fetch("/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: user.refreshToken,
        }),
      });
      if (response.ok) {
        console.log("logged out successfully");
        navigate("/", { replace: true });
        setUser(null);
      } else {
        console.error("Logout request failed:", response.status);
      }
    } catch (err) {
      console.error(err.message);
    }
  }, [setUser, navigate, user]);

  // signup function
  const signup = useCallback(
    async (payload) => {
      try {
        const response = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            password: payload.password,
          }),
        });
        if (!response.ok) {
          console.error("Sign up request failed:", response.status);
          return;
        }
        const receivedResponse = await response.json();
        console.log(receivedResponse);
        alert(
          "Sign up successful. You will now be redirected to your profile page."
        );
        navigate("/dashboard/profile", { replace: true });
        setUser({ email: payload.email });
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
