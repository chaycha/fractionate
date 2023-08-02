import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";

export const HomeLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (user) {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return (
    <div>
      <AppBar
        leftPages={[{ label: "Home", path: "/" }]}
        rightPages={[
          { label: "Log In", path: "/login" },
          { label: "Sign Up", path: "/signup" },
        ]}
      />
      {outlet}
    </div>
  );
};
