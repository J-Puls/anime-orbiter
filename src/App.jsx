import { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { GlobalAppProvider } from 'context/GlobalContext';
import MainNavbar from 'components/ui/MainNavbar';
import { Alert } from 'react-bootstrap';
import { Utils } from 'helpers/Utils';
import Views from 'views';

export const App = props => {

    const storedUser = JSON.parse(window.sessionStorage.getItem('user'));
    const defaultModalInfo = { title: null, body: null, footer: null };

    const { location } = useHistory();
    const [billboardTitle, setBillboardTitle] = useState(null);
    const [currentView, setCurrentView] = useState(
        location.pathname.replace('/', '')
    );
    const [messages, setMessages] = useState([]);
    const [messagesVisible, setMessagesVisible] = useState(false);
    const [modalInfo, setModalInfo] = useState(defaultModalInfo);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [user, setUser] = useState(
        storedUser ?? { credentials: {}, list: [] }
    );

    useEffect(() => {

        setMessagesVisible(messages.length > 0);
    
    }, [messages]);

    useEffect(() => {

        if (!billboardTitle && user?.list?.length)
            setBillboardTitle(user.list[0]);
    
    }, [user.list, billboardTitle]);

    const resetModalAndClose = () => {

        setModalVisible(false);
        setModalInfo(defaultModalInfo);
    
    };

    const removeMessage = message => {

        const filteredMessages = messages.filter((ind, val) => val === message);
        setMessages(filteredMessages);
    
    };

    const context = {
        billboard_title: billboardTitle,
        current_view: currentView,
        messages,
        messages_visible: messagesVisible,
        modal_info: modalInfo,
        modal_visible: modalVisible,
        resetModalAndClose,
        search_results: searchResults,
        setBillboardTitle,
        setCurrentView,
        setMessages,
        setMessagesVisible,
        setModalInfo,
        setModalVisible,
        setSearchResults,
        setUser,
        user
    };

    return (
        <GlobalAppProvider value={context}>
            <Utils>
                <div className="app-container">
                    <MainNavbar />

                    {!!messages?.length &&
                        messages.map((message, ind) => (
                            <Alert
                                key={ind}
                                dismissible
                                show={messagesVisible}
                                className={`text-center bg-${message.type}`}
                                onClose={() => removeMessage(message)}
                            >
                                <p>
                                    {message.type === 'error'
                                        ? message.error
                                        : message.message}
                                </p>
                            </Alert>
                        ))}

                    <Switch>
                        <Route path="/" exact component={Views.Landing} />
                        <Route
                            path="/authentication"
                            exact
                            component={Views.Authentication}
                        />
                        <Route
                            path="/dashboard"
                            exact
                            component={Views.Dashboard}
                        />
                    </Switch>
                </div>
            </Utils>
        </GlobalAppProvider>
    );

};

export default App;
