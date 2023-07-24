import { useState, useEffect, useContext } from 'react';
import GlobalAppContext from '../GlobalContext';

export const useMessages = () => {

    const context = useContext(GlobalAppContext);

    const [ messages, setMessages ] = useState(context.messages);
    useEffect(() => {

        setMessages(context.messages);
  
    }, [ context.messages ]);
    return messages;

};
export default useMessages;
