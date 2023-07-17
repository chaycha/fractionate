import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  // If not logged in, navigate to home page
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <AppBar
        leftPages={[
          { label: "Your Assets", path: "your-assets" },
          { label: "Submit Assets", path: "submit-assets" },
          { label: "Trade", path: "trade" },
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
