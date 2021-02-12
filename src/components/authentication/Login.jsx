import React, { useContext } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import GlobalAppContext from "../../context/GlobalContext";
// import InputUnderline from "../ui/InputUnderline";
// // Custom icons
// import rocketLanding from "assets/rocket-landing.svg";
// import rocketLanded from "assets/rocket-landed.svg";
// // Form animation
// import loginInputAnimation from "./login_input_animation";
import { useMessages } from "../../context/hooks";
import authenticateAndLogin from "../../utils/authentication/authenticateAndLogin";
import navTo from "../../utils/navigation/navTo";
import getUserInfo from "../../utils/user/getUserInfo";

export const Login = () => {
  const history = useHistory();
  const GlobalContext = useContext(GlobalAppContext);
  const messages = useMessages();
  let email, password;
  const attemptLogin = async (e) => {
    e.preventDefault();
    const userCredentials = {
      email: email.value,
      password: password.value,
    };
    try {
      const data = await authenticateAndLogin(userCredentials);
      if (data.error !== undefined) {
        GlobalContext.setMessages([
          ...messages,
          { message: data.error, dismissed: false, type: data.type },
        ]);
        throw Error(data.error);
      } else {
        const response = await getUserInfo({
          token: data.token,
          username: data.username,
          uid: data.uid,
        });
        GlobalContext.setUser({
          session_token: data.token,
          credentials: response.credentials,
          list: response.list.reverse(),
        });
        navTo(history, GlobalContext, "dashboard", "overview");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignUpClick = () => {
    navTo(history, GlobalContext, "authentication", "sign_up");
  };

  return (
    <Container>
      <Form
        id="loginForm"
        className="justify-content-center flex-column auth-form"
        onSubmit={(e) => attemptLogin(e)}
      >
        <legend className="text-center h1">Log In</legend>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            ref={(el) => (email = el)}
            type="email"
            id="login-email"
            className="auth-input auth-login-input"
            required
            defaultValue={process.env.REACT_APP_PUBLIC_USER_EMAIL}
          />

          {/* <InputUnderline tar="login-email" /> */}
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            ref={(el) => (password = el)}
            type="password"
            id="login-password"
            className="auth-input auth-login-input"
            required
            defaultValue={process.env.REACT_APP_PUBLIC_USER_PASSWORD}
          />
          {/* <InputUnderline tar="login-password" /> */}
        </Form.Group>

        <Button
          type="submit"
          variant="outline-danger"
          size="lg"
          className="w-100 mb-2"
        >
          Blast Off
        </Button>
        <small>
          Need an account?{" "}
          <Button
            variant="link"
            size="sm"
            className="py-0"
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
        </small>

        <p className="mt-5">
          To use the public demo account, please use the following credentials:
        </p>
        <ul className="list-group list-group-flush ">
          <li className="list-group-item bg-transparent">
            <strong>Email:</strong>{" "}
            <span className="text-warning">
              {process.env.REACT_APP_PUBLIC_USER_EMAIL}
            </span>
          </li>
          <li className="list-group-item bg-transparent">
            <strong>Password:</strong>{" "}
            <span className="text-warning">
              {process.env.REACT_APP_PUBLIC_USER_PASSWORD}
            </span>
          </li>
        </ul>
      </Form>
    </Container>
  );
};

export default Login;
