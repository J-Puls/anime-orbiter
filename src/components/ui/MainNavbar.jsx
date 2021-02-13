import { useContext } from "react";
import { Dropdown, Navbar } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import GlobalAppContext from "../../context/GlobalContext";
import { useUserInfo } from "../../context/hooks";
// Custom Icons
// import rocket from "assets/rocket.svg";
// import logoutIcon from "assets/logout.svg";
// Styling
// import "./AuthenticatedHeader.css";
import navTo from "../../utils/navigation/navTo";

export const MainNavbar = (props) => {
  const GlobalContext = useContext(GlobalAppContext);
  const history = useHistory();
  const user = useUserInfo();
  const handleLogout = (e) => {
    GlobalContext.setUser({});
    GlobalContext.setBillboardTitle(null);
    navTo(history, GlobalContext, "", "landing");
  };

  const handleDashboardNav = () => {
    navTo(history, GlobalContext, "dashboard", "overview");
  };

  const handleSettingsNav = () => {
    navTo(history, GlobalContext, "dashboard", "settings");
  };

  return (
    <Navbar variant="dark" id="navbar" expand="xs" className="navbar">
      <Navbar.Brand className="slide-in-right h-100">
        {/* <Image src={rocket} fluid className="p-2 my-1 h-75" /> */}
        Anime Orbiter
      </Navbar.Brand>

      {user.session_token !== undefined && (
        <>
          <Dropdown className="ml-auto">
            <Dropdown.Toggle variant="link" id="account-dropdown">
              <img
                src={user.credentials.image_url}
                className="user-nav-img ml-1"
                width={50}
                height={50}
                alt="profile"
              />
            </Dropdown.Toggle>

            <Dropdown.Menu align="right">
              <Dropdown.Item onClick={handleDashboardNav}>
                Dashboard
              </Dropdown.Item>
              <Dropdown.Item onClick={handleSettingsNav}>
                Settings
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleLogout(e)}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}
    </Navbar>
  );
};

export default MainNavbar;
