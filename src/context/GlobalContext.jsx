import { createContext, useContext } from "react";

export const GlobalAppContext = createContext({
  displayName: "GlobalAppContext",
});

export const GlobalAppConsumer = GlobalAppContext.Consumer;
export const GlobalAppProvider = GlobalAppContext.Provider;

export const useGlobalApp = () => useContext(GlobalAppContext);

export default GlobalAppContext;
