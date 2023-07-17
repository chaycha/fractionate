import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer,
} from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { HomePage } from "./pages/Home";
import { SignUpPage } from "./pages/SignUp";
import { ProfilePage } from "./pages/Profile";
import { SettingsPage } from "./pages/Settings";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { HomeLayout } from "./components/HomeLayout";
import { AuthLayout } from "./components/AuthLayout";
import "./styles.css";
import { YourAssetsPage } from "./pages/YourAssets";
import { SubmitAssetsPage } from "./pages/SubmitAssets";
import { TradePage } from "./pages/Trade";

// ideally, instead of setTimeout, it would be an API call to server to get logged in user data

const getUserData = () =>
  new Promise(
    (resolve) =>
      setTimeout(() => {
        const user = window.localStorage.getItem("user");
        resolve(user);
      }, 3000) // set loading delay of 3000ms to allow the promise to be completed
  );

// for error
// const getUserData = () =>
//   new Promise((resolve, reject) =>
//     setTimeout(() => {
//       reject("Error");
//     }, 3000)
//   );

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
    >
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="your-assets" element={<YourAssetsPage />} />
        <Route path="submit-assets" element={<SubmitAssetsPage />} />
        <Route path="trade" element={<TradePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Route>
  )
);
