import { useContext, useState } from "react";
import { Button, Col, Container, Figure, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import GlobalAppContext from "../../context/GlobalContext";
import { useMessages, useUserInfo } from "../../context/hooks";
import {
  attemptUpdateLocation,
  attemptUpdateMotto,
  attemptUpdateUsername,
  deleteExistingUser,
  navTo
} from "../../utils";
import UserInfoUpdateForm from "../settings/UserInfoUpdateForm";

export const Settings = () => {
  const GlobalContext = useContext(GlobalAppContext);
  const history = useHistory();
  const user = useUserInfo();
  const messages = useMessages();
  const { credentials } = user;
  const defaultFormText = { message: "", type: null };
  const token = window.sessionStorage.getItem("token");
  let username, motto, userLocation;

  const [usernameFormText, setUsernameFormText] = useState(defaultFormText);
  const [mottoFormText, setMottoFormText] = useState(defaultFormText);
  const [locationFormText, setLocationFormText] = useState(defaultFormText);

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    const newUsername = username.value;
    if (newUsername === credentials.username) {
      setUsernameFormText({
        message: "This is already your username!",
        type: "danger",
      });
    } else {
      const response = await attemptUpdateUsername({
        currentUsername: credentials.username,
        newUsername,
        token,
        uid: credentials.uid,
      });

      if (response.type === "success") {
        setUsernameFormText({
          message: response.message,
          type: response.type,
        });
        GlobalContext.setUser({
          ...user,
          credentials: {
            ...credentials,
            username: response.username,
          },
        });
      } else {
        setUsernameFormText({
          message: response.error,
          type: response.type,
        });
      }
    }
  };

  const handleChangeMotto = async (e) => {
    e.preventDefault();
    const newMotto = motto.value;
    const currentMotto = credentials.motto;
    if (newMotto === currentMotto) {
      setMottoFormText({
        message: "This is already your motto!",
        type: "danger",
      });
    } else {
      const response = await attemptUpdateMotto({
        currentMotto,
        newMotto,
        token,
        uid: credentials.uid,
      });
      if (response.type === "success") {
        setMottoFormText({
          message: response.message,
          type: response.type,
        });
        GlobalContext.setUser({
          ...user,
          credentials: {
            ...credentials,
            motto: response.motto,
          },
        });
      } else {
        setMottoFormText({
          message: response.error,
          type: response.type,
        });
      }
    }
  };

  const handleChangeLocation = async (e) => {
    e.preventDefault();
    const newLocation = userLocation.value;
    const currentLocation = credentials.location;
    if (newLocation === currentLocation) {
      setLocationFormText({
        message: "This is already your location!",
        type: "danger",
      });
    } else {
      const response = await attemptUpdateLocation({
        currentLocation,
        newLocation,
        token,
        uid: credentials.uid,
      });
      if (response.type === "success") {
        setLocationFormText({
          message: response.message,
          type: response.type,
        });
        GlobalContext.setUser({
          ...user,
          credentials: {
            ...credentials,
            location: response.location,
          },
        });
      } else {
        setLocationFormText({
          message: response.error,
          type: response.type,
        });
      }
    }
  };

  const setModalInfoDelete = () => {
    GlobalContext.setModalInfo({
      title: "Delete Account",
      body: `<p class="text-center">
          Are you sure you want to delete your account?
          <br />
          <strong class="text-danger">This cannot be undone!</strong>
        </p>`,
      footer: (
        <>
          <Button variant="outline-danger" onClick={handleDeleteAccount}>
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={GlobalContext.resetModalAndClose}
          >
            Cancel
          </Button>
        </>
      ),
    });
    GlobalContext.setModalVisible(true);
  };

  const handleDeleteAccount = async () => {
    const credentials = {
      username: credentials.username,
      uid: credentials.uid,
      token,
    };

    const response = await deleteExistingUser(credentials);
    if (response.type === "success") {
      navTo(history, GlobalContext, "", "landing");
      window.sessionStorage.clear();
      GlobalContext.setUser({});
    }
    GlobalContext.setMessages([
      ...messages,
      {
        type: response.type,
        message:
          response.type === "success" ? response.message : response.error,
      },
    ]);
  };

  const isPublicAccount =
    credentials.uid === process.env.REACT_APP_PUBLIC_USER_UID;

  return (
    <Container className="settings">
      <Row className="justify-content-center" noGutters>
        <Col xs={6} className="d-flex justify-content-around">
          <Figure>
            <Figure.Image src={credentials.image_url}></Figure.Image>
            <Figure.Caption className="text-center">
              <span className="lead text-danger">{credentials.username}</span>
              <br />
              {credentials.email}
              <br />
              <span>
                {credentials.motto ? credentials.motto : "No Motto Set"}
              </span>
              <br />
              <span>
                {credentials.location
                  ? credentials.location
                  : "No Location Set"}
              </span>
            </Figure.Caption>
          </Figure>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center my-3" noGutters>
        <Col xs={12} md={8} className="border rounded p-3">
          <p className="h3 mb-5">General</p>
          <UserInfoUpdateForm
            ariaLabel="Change username"
            defaultValue={credentials.username}
            formText={usernameFormText}
            id="change-username"
            label="Change Username"
            onClick={(e) => handleChangeUsername(e)}
            ref={(el) => (username = el)}
            disabled={isPublicAccount}
          />
          <UserInfoUpdateForm
            ariaLabel="Change motto"
            defaultValue={credentials.motto || null}
            formText={mottoFormText}
            id="change-motto"
            label="Change Motto"
            onClick={(e) => handleChangeMotto(e)}
            placeholder={credentials.motto ? null : "enter your motto"}
            ref={(el) => (motto = el)}
            disabled={isPublicAccount}
          />
          <UserInfoUpdateForm
            ariaLabel="Change location"
            defaultValue={credentials.location || null}
            formText={locationFormText}
            id="change-location"
            label="Change Location"
            onClick={(e) => handleChangeLocation(e)}
            placeholder={credentials.location ? null : "enter your location"}
            ref={(el) => (userLocation = el)}
            disabled={isPublicAccount}
          />
        </Col>
      </Row>
      <Row className="d-flex justify-content-center my-3" noGutters>
        <Col
          xs={12}
          md={8}
          className=" d-flex justify-content-center flex-column border border-danger rounded p-3"
        >
          <p className="h3 text-danger mb-5">Danger Zone</p>
          <Button
            variant="outline-secondary"
            disabled={isPublicAccount}
            onClick={setModalInfoDelete}
          >
            Delete Account
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
