import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import { useCurrentView } from "../context/hooks";

export const AuthenticationView = () => {
  const currentView = useCurrentView();
  return currentView === "login" ? <Login /> : <SignUp />;
};

export default AuthenticationView;
