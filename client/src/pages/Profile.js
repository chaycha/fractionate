import { BasicPage } from "../components/BasicPage";
import Person from "@mui/icons-material/Person";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const ProfilePage = () => {
  const [user] = useLocalStorage("user", {}); // Access user data stored in local storage
  const title = `${user.email}'s Profile Page`; // get the user email from the user object
  return <BasicPage title={title} icon={<Person />}></BasicPage>;
};
