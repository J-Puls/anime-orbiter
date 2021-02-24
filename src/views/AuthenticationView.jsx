import { Login, SignUp } from "../components";
import { useCurrentView } from "../context/hooks";

export const AuthenticationView = () => {
  const currentView = useCurrentView();
  return currentView === "login" ? <Login /> : <SignUp />;
};

export default AuthenticationView;
