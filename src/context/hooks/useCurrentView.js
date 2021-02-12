import { useState, useEffect, useContext } from "react";
import { GlobalAppContext } from "../GlobalContext";

export const useCurrentView = () => {
  const context = useContext(GlobalAppContext);

  const [currentView, setCurrentView] = useState(context.current_view);

  useEffect(() => {
    setCurrentView(context.current_view);
  }, [context.current_view]);

  return currentView;
};

export default useCurrentView;
