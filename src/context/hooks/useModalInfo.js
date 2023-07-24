import { useState, useEffect, useContext } from 'react';
import GlobalAppContext from '../GlobalContext';

export const useModalInfo = () => {

    const context = useContext(GlobalAppContext);

    const [modalInfo, setModalInfo] = useState(context.modal_info);
    useEffect(() => {

        setModalInfo(context.modal_info);
  
    }, [context.modal_info]);
    return modalInfo;

};
export default useModalInfo;
