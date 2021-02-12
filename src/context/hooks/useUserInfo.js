import { useState, useEffect, useContext } from "react";
import GlobalAppContext from "../GlobalContext";

export const useUserInfo = () => {
  const context = useContext(GlobalAppContext);

  const [userInfo, setUserInfo] = useState(context.user);
  useEffect(() => {
    setUserInfo(context.user);
  }, [context.user]);
  return userInfo;
};
export default useUserInfo;
