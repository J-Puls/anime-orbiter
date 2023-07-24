import React, { useContext } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import GlobalAppContext from '../../context/GlobalContext';
import { useMessages } from '../../context/hooks';
import { navTo, signUpNewUser } from '../../utils';

export const SignUp = (props) => {

    const GlobalContext = useContext(GlobalAppContext);
    const history = useHistory();
    const messages = useMessages();
    let username, email, password, confirmPassword;

    const attemptSignup = async (e) => {

        e.preventDefault();
        const credentials = {
            username: username.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
        };
        if (credentials.password !== credentials.confirmPassword) {

            GlobalContext.setMessages([
                ...messages,
                {
                    error: 'Password and Confirm Password fields must be identical!',
                    type: 'error',
                    dismissed: false,
                },
            ]);
        
        } else {

            try {

                const data = await signUpNewUser(credentials);
                if (data.error) {

                    GlobalContext.setMessages([
                        ...messages,
                        { message: data.error, dismissed: false, type: data.type },
                    ]);
                    throw Error(data.error);
                
                } else {

                    GlobalContext.setMessages([
                        ...messages,
                        { message: data.message, type: data.type, dismissed: false },
                    ]);
                    GlobalContext.setUser({
                        credentials: { ...data.credentials },
                        list: [],
                    });
                    window.sessionStorage.setItem('token', data.token);
                    navTo(history, GlobalContext, 'dashboard', 'overview');
                
                }
            
            } catch (err) {

                console.error(err);
            
            }
        
        }
    
    };

    const handleLoginClick = () => {

        navTo(history, GlobalContext, 'authentication', 'login');
    
    };

    return (
    <Container>
      <Form
        id="signupForm"
        className="auth-form justify-content-center flex-column"
        onSubmit={(e) => attemptSignup(e)}
      >
        <legend className="text-center h1">Sign Up</legend>
        <Form.Group>
          <label htmlFor="signup-username">Username</label>
          <Form.Control
            ref={(el) => (username = el)}
            type="text"
            id="signup-username"
            className="auth-input auth-signup-input"
            required
          />
        </Form.Group>
        <Form.Group>
          <label htmlFor="signup-email">Email</label>
          <Form.Control
            ref={(el) => (email = el)}
            type="email"
            id="signup-email"
            className="auth-input auth-signup-input"
            required
          />
        </Form.Group>
        <Form.Group>
          <label htmlFor="signup-password">Password</label>
          <Form.Control
            ref={(el) => (password = el)}
            type="password"
            id="signup-password"
            className="auth-input auth-signup-input"
            required
          />
        </Form.Group>
        <Form.Group>
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <Form.Control
            ref={(el) => (confirmPassword = el)}
            type="password"
            id="signup-confirm-password"
            className="auth-input auth-signup-input"
            required
          />
        </Form.Group>

        <Button
          type="submit"
          variant="outline-danger"
          size="lg"
          className="w-100 mb-2"
        >
          Register
        </Button>
        <small>
          Already have an account?{' '}
          <Button
            variant="link"
            size="sm"
            className="py-0"
            onClick={handleLoginClick}
          >
            Log in
          </Button>
        </small>
      </Form>
    </Container>
    );

};

export default SignUp;
