import { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Billboard, DashboardCard } from "../../components";
import GlobalAppContext from "../../context/GlobalContext";
import { useBillboardTitle, useUserInfo } from "../../context/hooks";
import { navTo, toggleFavorite } from "../../utils";


export const Dashboard = () => {
  const GlobalContext = useContext(GlobalAppContext);
  const user = useUserInfo();
  const history = useHistory();
  const billboardTitle = useBillboardTitle();
  const [scrollOffset, setScrollOffset] = useState(0);

  const isMobile = window.innerWidth <= 1200;

  const handleChangeBillboardTitle = (title) => {
    GlobalContext.setBillboardTitle(title);
  };

  const handleAddMoreClick = () => {
    navTo(history, GlobalContext, "dashboard", "search");
  };

  const handleToggleFavorite = async (titleId) => {
    const response = await toggleFavorite({
      titleId,
      uid: user.credentials.uid,
      token: window.sessionStorage.getItem("token"),
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

  const disablePageScroll = () => { 
    document.body.style.width = "calc(100% - 10px)";
    document.body.style.overflow = "hidden"
  }

  const enablePageScroll = () => {
    document.body.style.width = "100%";
    document.body.style.overflow = "auto"
  }

  const handleScroll = (e) => {
    if (window.innerWidth <= 1200) return;
    const direction = e.deltaY > 0 ? "up" : "down";

    switch(direction){
      case "down":
        scrollOffset > 0 && setScrollOffset(scrollOffset - 105);
        break;
      case "up":
        (scrollOffset <= ((user?.list?.length + .5) * 210) - window.innerWidth) && setScrollOffset(scrollOffset + 105);
        break;
      default:
        break;
    }

  }

  return (
    <>
      {user.list.length > 0 && <Billboard />}

      <div className="px-3">
        <div className=" d-flex justify-content-between my-3">
          <p className="h3 text-light slide-in-right">My Titles</p>{" "}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleAddMoreClick}
          >
            Add More +
          </Button>
        </div>

        {user.list.length <= 0 && (
          <p className="text-center">
            Looks like you haven't added any titles yet!
          </p>
        )}

        <div className="card-container" onMouseEnter={disablePageScroll} onMouseLeave={enablePageScroll}>
         {!isMobile ?
          (
            <div className="card-scroller" onWheel={ e => handleScroll(e)} style={{display: "flex", transform: `translate3d(-${scrollOffset}px, 0, 0)`}}>
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
          ) 
          :
          (<>
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
            </>)
        }
        </div>
      </div>
    </>
  );
};

export default Dashboard;
