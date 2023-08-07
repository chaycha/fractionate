import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer,
} from "react-router-dom";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { SignUpPage } from "./pages/SignUp";
import { ProfilePage } from "./pages/Profile";
import { SettingsPage } from "./pages/Settings";
import { MyAssetsPage } from "./pages/MyAssets";
import { SubmitAssetsPage } from "./pages/SubmitAssets";
import { TransferPage } from "./pages/Transfer";
import { ProposalsPage } from "./pages/Proposals";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { HomeLayout } from "./components/HomeLayout";
import { AuthLayout } from "./components/AuthLayout";

// ideally, instead of setTimeout, it would be an API call to server to get logged in user data

const getUserData = () =>
  new Promise(
    (resolve) =>
      setTimeout(() => {
        const user = window.localStorage.getItem("user");
        resolve(user);
      }, 1500) // set loading delay of 1500ms to allow the promise to be completed
  );

export const App = createBrowserRouter(
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
        <Route path="my-assets" element={<MyAssetsPage />} />
        <Route path="my-assets/:tokenId" element={<ProposalsPage />} />
        <Route path="submit-assets" element={<SubmitAssetsPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Route>
  )
);
