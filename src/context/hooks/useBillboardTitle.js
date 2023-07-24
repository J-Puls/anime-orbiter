import { useState, useEffect, useContext } from 'react';
import { GlobalAppContext } from '../GlobalContext';

export const useBillboardTitle = () => {

    const context = useContext(GlobalAppContext);

    const [billboardTitle, setBillboardTitle] = useState(context.billboard_title);

    useEffect(() => {

        setBillboardTitle(context.billboard_title);
  
    }, [context.billboard_title]);

    return billboardTitle;

};

export default useBillboardTitle;
