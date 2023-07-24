import React from 'react';
import { UtilsProvider } from 'context/UtilsContext';

export const Utils = ({ children }) => {

    const context = {};

    return (
        <UtilsProvider value={context}>
            {children}
        </UtilsProvider>
    )

}