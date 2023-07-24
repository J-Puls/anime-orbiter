import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import mainLogo from '../assets/svg/main_logo.svg';
import { Button, Col, Row } from 'react-bootstrap';
import GlobalAppContext from '../context/GlobalContext';
import { navTo } from '../utils';

export const LandingView = () => {

    const history = useHistory();
    const GlobalContext = useContext(GlobalAppContext);

    const handleLoginClick = () => {

        navTo(history, GlobalContext, 'authentication', 'login');
    
    };

    return (
    <div className="landing-container">
      <Row className="justify-content-center flex-column" noGutters>
        <img
          className="main-logo"
          width={150}
          height={75}
          src={mainLogo}
          alt="main logo"
        />
        <Col className="text-center">
          <Button
            variant="link"
            className="text-danger"
            onClick={handleLoginClick}
          >
            <strong>Log in / Sign Up</strong>
          </Button>
        </Col>
      </Row>
    </div>
    );

};

export default LandingView;
