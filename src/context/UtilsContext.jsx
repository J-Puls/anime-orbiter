import { createContext, useContext } from 'react';

export const UtilsContext = createContext({
    displayName: 'UtilsContext',
});

export const UtilsConsumer = UtilsContext.Consumer;
export const UtilsProvider = UtilsContext.Provider;

export const useUtils = () => useContext(UtilsContext);

export default UtilsContext;
