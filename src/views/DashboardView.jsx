import { useContext, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Dashboard, FindTitles, InfoModal, Settings } from '../components';
import GlobalAppContext from '../context/GlobalContext';
import { useCurrentView, useUserInfo } from '../context/hooks';
import { navTo } from '../utils';

export const DashboardView = () => {

    const credentials = useUserInfo().credentials;
    const GlobalContext = useContext(GlobalAppContext);
    const history = useHistory();
    const currentView = useCurrentView();

    // If user is not logged in, redirect to login page
    useLayoutEffect(() => {

        !credentials.uid && navTo(history, GlobalContext, 'authentication', 'login');
        currentView === 'dashboard' && navTo(history, GlobalContext, 'dashboard', 'overview');
    
    }, [history, GlobalContext, credentials, currentView]);
  
    return (
    <div className="py-5">
      {currentView === 'overview' && <Dashboard />}
      {currentView === 'search' && <FindTitles />}
      {currentView === 'settings' && <Settings />}
      <InfoModal />
    </div>
    );

};

export default DashboardView;
