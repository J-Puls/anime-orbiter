import { useContext, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import GlobalAppContext from "context/GlobalContext";
import { useMessages } from "context/hooks";
import { authenticateAndLogin, getUserInfo, navTo } from "utils";

export const Login = props => {

  const [loading, setLoading] = useState(false);

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

      setLoading(true);

      const data = await authenticateAndLogin(userCredentials);

      console.log(data)

      if (!!data?.error) {

        GlobalContext.setMessages([
          ...messages,
          { message: data.error, dismissed: false, type: data.type },
        ]);

        setLoading(false);
        throw Error(data.error);

      } else {

        const response = await getUserInfo({
          token: data.token,
          username: data.username,
          uid: data.uid,
        });

        GlobalContext.setUser({
          credentials: response.credentials,
          list: response.list.reverse(),
        });

        window.sessionStorage.setItem("token", data.token);
        setLoading(false)

        navTo(history, GlobalContext, "dashboard", "overview");

      }
    } catch (err) {

      console.error(err);

    }
  };

  const handleSignUpClick = () => navTo(history, GlobalContext, "authentication", "sign_up");

  return (
    <Container>
      <Form
        id="loginForm"
        className="justify-content-center flex-column auth-form"
        onSubmit={(e) => attemptLogin(e)}
      >
        <legend className="text-center h1">Log In</legend>
        <Form.Group>
          <Form.Label>
            Email
          </Form.Label>
          <Form.Control
            ref={el => email = el}
            type="email"
            id="login-email"
            className="auth-input auth-login-input"
            required
            defaultValue={process.env.REACT_APP_PUBLIC_USER_EMAIL}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>
            Password
          </Form.Label>
          <Form.Control
            ref={el => password = el}
            type="password"
            id="login-password"
            className="auth-input auth-login-input"
            required
            defaultValue={process.env.REACT_APP_PUBLIC_USER_PASSWORD}
          />
        </Form.Group>

        <Button type="submit" variant="outline-danger" size="lg" className="w-100 mb-2 d-flex align-items-center justify-content-center">
          {!loading ?
            (
              <span>
                Blast off!
              </span>
            )
            :
            (
              <>
                <Spinner animation='border' size='sm' className="m-2" />
              </>


            )
          }
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
