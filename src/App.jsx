import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { Route, Switch, useHistory } from "react-router-dom";
import MainNavbar from "./components/ui/MainNavbar";
import { GlobalAppProvider } from "./context/GlobalContext";
import Views from "./views";

function App() {
  const defaultModalInfo = { title: null, body: null, footer: null };
  const history = useHistory();
  const [billboardTitle, setBillboardTitle] = useState(null);
  const [currentView, setCurrentView] = useState(history.location.pathname);
  const [messages, setMessages] = useState([]);
  const [messagesVisible, setMessagesVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState(defaultModalInfo);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    setMessagesVisible(messages.length > 0);
  }, [messages]);

  useEffect(() => {
    if (!billboardTitle) user.list && setBillboardTitle(user.list[0]);
  }, [user.list, billboardTitle]);

  const resetModalAndClose = () => {
    setModalVisible(false);
    setModalInfo(defaultModalInfo);
  };

  const removeMessage = (message) => {
    const filteredMessages = messages.filter((ind, val) => {
      return val === message;
    });
    setMessages(filteredMessages);
  };

  const defaultContext = {
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
    user,
  };
  return (
    <GlobalAppProvider value={defaultContext}>
      <div className="app-container">
        <MainNavbar />
        {messages.length > 0 &&
          messages.map((message, ind) => (
            <Alert
              key={ind}
              dismissible
              show={messagesVisible}
              className={`text-center bg-${message.type}`}
              onClose={() => removeMessage(message)}
            >
              <p>
                {message.type === "error" ? message.error : message.message}
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
          <Route path="/dashboard" exact component={Views.Dashboard} />
        </Switch>
      </div>
    </GlobalAppProvider>
  );
}

export default App;
