import { useContext } from "react";
import { Button } from "react-bootstrap";
import GlobalAppContext from "../../context/GlobalContext";
import { useUserInfo } from "../../context/hooks";
import addTitle from "../../utils/content/addTitle";

export const SearchResultCard = (props) => {
  const title = props.title;
  const GlobalContext = useContext(GlobalAppContext);
  const user = useUserInfo();
  const isInList = () => {
    for (const entry of user.list) {
      if (entry.id === title.id) {
        return true;
      }
    }
    return false;
  };

  const handleSave = async () => {
    if (isInList()) {
      alert("This title is already in your list!");
      return;
    }

    const response = await addTitle({
      token: user.session_token,
      title,
      uid: user.credentials.uid,
    });
    GlobalContext.setUser({
      ...user,
      list: response.list.reverse(),
    });
    GlobalContext.setBillboardTitle(response.list[0] || null);
  };

  const handleCloseModal = () => {
    GlobalContext.resetModalAndClose();
  };
  const setModalInfoAbout = () => {
    GlobalContext.setModalInfo({
      title: title.name,
      body: title.summary,
      footer: (
        <Button variant="outline-secondary" onClick={handleCloseModal}>
          Close
        </Button>
      ),
    });
    GlobalContext.setModalVisible(true);
  };

  return (
    <div
      style={{ backgroundImage: `url("${title.image.medium.replace("http://", "https://")}")` }}
      className="title-card search-result position-relative m-1 rounded"
    >
      <div className="title-card-overlay position-absolute top-0 left-0 d-flex flex-column justify-content-around text-center">
        <p className="lead">{title.name}</p>
        {!isInList() ? (
          <div className="card-buttons d-flex justify-content-around">
            <Button size="sm" variant="secondary" onClick={setModalInfoAbout}>
              About
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave}>
              Save to List
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-center flex-column text-center">
            <svg
              className="align-self-center"
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="green"
            >
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
            <p>This title is in your list!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultCard;
