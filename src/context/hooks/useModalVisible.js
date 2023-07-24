import { useState, useEffect, useContext } from 'react';
import GlobalAppContext from '../GlobalContext';

export const useModalVisible = () => {

    const context = useContext(GlobalAppContext);

    const [modalVisible, setModalVisible] = useState(context.modal_visible);
    useEffect(() => {

        setModalVisible(context.modal_visible);
  
    }, [context.modal_visible]);
    return modalVisible;

};
export default useModalVisible;
