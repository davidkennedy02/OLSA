import React from "react";
import NavbarOut from "../../Components/NavBarOut/NavBarOut";
import s from './LoginStyle.module.css';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {useState} from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import {useNavigate} from 'react-router-dom';
axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';

function Login() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({});

    const [alert, setAlert] = useState(false);

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Check your login credentials and try again!
                </p>
              </Alert>
            );
          }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }
    
    const handleLogin = async (event) => {
        event.preventDefault();

        console.log(inputs);

        // Get the response from the server
        const response = await axios.post('/login', inputs)
        console.log(response);

        if (response.data === "Success") {
            localStorage.setItem('user', inputs.username);
            navigate('/olsa/');
        } else if (response.data === "Failure") {
            setAlert(true);
        } else {
            console.log(response);
        }
    }

    return(
        <main>  
            <div className={s.background_1}>
                <NavbarOut></NavbarOut>
            
                <div id={s.title_container}>
                    <h1 id={s.title}>Login</h1>
                </div>

                <Card id={s.form_card}>
                    <Card.Body>
                        <form id={s.form_container}>
                            <AlertDismissible/>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Username"
                                className="mb-3"
                            >
                                <Form.Control 
                                    type="username" 
                                    name='username'
                                    placeholder="username" 
                                    onChange={handleChange}
                                    maxLength={100}
                                />
                            </FloatingLabel>
                            
                            <FloatingLabel 
                                controlId="floatingPassword" 
                                label="Password"
                            >
                                <Form.Control 
                                    type="password" 
                                    name='password'
                                    placeholder="Password" 
                                    onChange={handleChange}
                                    maxLength={100}
                                />
                            </FloatingLabel>

                            <Button id={s.submit_button} onClick={handleLogin} variant="primary">Login</Button>
                        </form>
                    </Card.Body>
                </Card>
                

        
                <div className={s.footer}>
                  <p>Copyright @ 2024 OLSA Inc</p>
                  <p>dk94@st-andrews.ac.uk</p>
                  <p>Made with React</p>
                </div>
            </div>
        </main>
    );
}
 
export default Login;