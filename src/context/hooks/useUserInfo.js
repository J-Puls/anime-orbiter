import { useState, useEffect, useContext } from 'react';
import GlobalAppContext from '../GlobalContext';

export const useUserInfo = () => {

    const context = useContext(GlobalAppContext);
    const [userInfo, setUserInfo] = useState(
        JSON.parse(window.sessionStorage.getItem('user'))
    );

    useEffect(() => {

        setUserInfo(context.user);
        window.sessionStorage.setItem('user', JSON.stringify(userInfo));
  
    }, [context.user, userInfo]);
    return userInfo;

};
export default useUserInfo;
