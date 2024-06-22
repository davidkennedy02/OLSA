import React from "react";
import NavbarOut from "../../Components/NavBarOut/NavBarOut";
import styles from './CreateAccountStyle.module.css';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import Footer from "../../Components/Footer/Footer";

axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';
 
function CreateAccount() {

    const navigate = useNavigate();

    const [alert, setAlert] = useState(false);

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  This username has already been taken!
                </p>
              </Alert>
            );
          }
    }

    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log(inputs);

        // Get the response from the server
        const response = await axios.post('/create_account', inputs)
        console.log(response);

        if (response.data === "Username taken"){ 
            setAlert(true);
        }

        if (response.data === "User created") {
            localStorage.setItem('user', inputs.username)
            navigate("/olsa/");
        }
    }

    return (
        <main>  
            <div className={styles.background_1}>
                <NavbarOut></NavbarOut>
            
                <div id={styles.title_container}>
                    <h1 id={styles.title}>Create an account</h1>
                </div>

                <Card id={styles.form_card}>
                    <Card.Body>
                        <form id={styles.form_container}>
                            <AlertDismissible />
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Username"
                                className="mb-3"
                            >
                                <Form.Control type="username" name="username" onChange={handleChange} placeholder="username" maxLength={100}/>
                            </FloatingLabel>

                            <FloatingLabel
                                controlId="floatingInput"
                                label="Password"
                                className="mb-3"
                            >
                                <Form.Control type="password" name="password" onChange={handleChange} placeholder="password" maxLength={100}/>
                            </FloatingLabel>

                            <Button id={styles.submit_button} onClick={handleSubmit} variant="primary">Create account</Button>
                        </form>
                    </Card.Body>
                </Card>
                

        
                <Footer/>
            </div>
        </main>
    );
}
 
export default CreateAccount;