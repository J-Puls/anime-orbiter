import { useContext } from "react";
import { Button, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Settings from "../components/authentication/Settings";
import { Billboard } from "../components/content/Billboard";
import DashboardCard from "../components/content/DashboardCard";
import FindTitles from "../components/search/FindTitles";
import GlobalAppContext from "../context/GlobalContext";
import {
  useCurrentView,
  useUserInfo,
  useBillboardTitle,
} from "../context/hooks";
import { toggleFavorite } from "../utils/content/toggleFavorite";
import navTo from "../utils/navigation/navTo";
import InfoModal from "../components/ui/InfoModal";

export const DashboardView = () => {
  const GlobalContext = useContext(GlobalAppContext);
  const user = useUserInfo();
  const history = useHistory();
  const currentView = useCurrentView();
  const billboardTitle = useBillboardTitle();

  const handleChangeBillboardTitle = (title) => {
    GlobalContext.setBillboardTitle(title);
  };
  const handleUnauthenticatedClick = () => {
    navTo(history, GlobalContext, "authentication", "login");
  };

  const handleAddTitlesClick = () => {
    navTo(history, GlobalContext, "dashboard", "search");
  };

  const handleToggleFavorite = async (titleId) => {
    const response = await toggleFavorite({
      titleId,
      uid: user.credentials.uid,
      token: user.session_token,
    });

    if (response.type === "success") {
      GlobalContext.setUser({ ...user, list: response.list.reverse() });

      if (billboardTitle.id === titleId) {
        GlobalContext.setBillboardTitle({
          ...billboardTitle,
          favorite: response.list.find((item) => item.id === titleId).favorite,
        });
      }
    }
  };

  return (
    <div className="py-5">
      {user.credentials === undefined ? (
        <Row
          className="justify-content-center flex-column text-center"
          noGutters
        >
          <p>You must be logged in to view this page.</p>
          <Button
            variant="link"
            className="text-danger"
            onClick={handleUnauthenticatedClick}
          >
            <strong>Log in / Sign Up</strong>
          </Button>
        </Row>
      ) : (
        <div>
          {currentView === "overview" && (
            <>
              {user.list.length > 0 && <Billboard />}

              <div className="px-3">
                <div className=" d-flex justify-content-between my-3">
                  <p className="h3 text-light slide-in-right">My Titles</p>{" "}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleAddTitlesClick}
                  >
                    Add More +
                  </Button>
                </div>

                {user.list.length <= 0 && (
                  <p className="text-center">
                    Looks like you haven't added any titles yet!
                  </p>
                )}

                <div className="card-container">
                  {user.list.map((title) => {
                    return (
                      <DashboardCard
                        key={title.id}
                        title={title}
                        onFavoriteToggle={handleToggleFavorite}
                        onClick={(title) => handleChangeBillboardTitle(title)}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {currentView === "search" && <FindTitles></FindTitles>}
          {currentView === "settings" && <Settings></Settings>}
          <InfoModal />
        </div>
      )}
    </div>
  );
};

export default DashboardView;
