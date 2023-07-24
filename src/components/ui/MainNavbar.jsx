import { useContext } from 'react';
import { Dropdown, Navbar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import GlobalAppContext from '../../context/GlobalContext';
import { useUserInfo } from '../../context/hooks';
import { navTo } from '../../utils';

export const MainNavbar = () => {

    const GlobalContext = useContext(GlobalAppContext);
    const history = useHistory();
    const user = useUserInfo();

    const handleLogout = () => {

        GlobalContext.setUser({ credentials: {}, list: [] });
        GlobalContext.setBillboardTitle(null);
        window.sessionStorage.clear();
        navTo(history, GlobalContext, '', 'landing');
    
    };

    const handleDashboardNav = () => {

        navTo(history, GlobalContext, 'dashboard', 'overview');
    
    };

    const handleSettingsNav = () => {

        navTo(history, GlobalContext, 'dashboard', 'settings');
    
    };

    return (
    <Navbar variant="dark" id="navbar" expand="xs" className="navbar">
      <Navbar.Brand className="slide-in-right h-100">
        Anime Orbiter
      </Navbar.Brand>

      {user && user.credentials.uid && (
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
              <Dropdown.Item onClick={e => handleLogout(e)}>
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
