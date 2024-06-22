import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarIn from './../../Components/NavBarIn/NavBarIn';
// import FlashcardComponent from '../../Components/FlashcardComponent/FlashcardComponent';
import s from './FlashcardsStyle.module.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FlashcardArray } from "react-quizlet-flashcard";
import sf from './../../Components/FlashcardComponent/FlashcardComponentStyle.module.css';
import Form from 'react-bootstrap/Form'; 
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';


function SelectSet(props) {

    // Transform set
    function transformSet() {

        // Only try to pass info to flashcard component if there is info to pass 
        if (props.flashcards && props.currentSet){

            const newSet = []

            props.flashcards.filter(flashcard => ([props.currentSet.flashcardsetid])
                                                .flat()
                                                .includes( flashcard.flashcardsets_flashcardsetid ))
                            .forEach((flashcard, index) => {
                                        newSet.push({
                                            id: flashcard.flashcardid,
                                            frontHTML: <div id={sf.question}>{flashcard.question}</div>,
                                            backHTML: <div id={sf.question}>{flashcard.answer}</div>
                                        })
                                    })

            return newSet;
        } else {
            return [];
        }
    }

    const handleDelete = async () => {
        if ( props.currentSet ) {
            await axios.post('delete_flashcard_set', 
            {
                flashcardsetid: props.currentSet.flashcardsetid,
                user: localStorage.getItem('user')
            })

            props.getSets();
            props.getFlashcards();
            props.onHide();
        }
    }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton onClick={props.onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
             {props.currentSet ? props.currentSet.name : undefined}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
          <div id={sf.flashcard_container}>
            <FlashcardArray cards={transformSet()} id={sf.flashcard}/>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button id={s.delete_button} variant="danger" onClick={handleDelete}>Delete</Button>
            <Button onClick={props.changeSet}>Edit</Button>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
    );

}

function AddSet(props) {

    const [inputs, setInputs] = useState({});
    const [alert, setAlert] = useState(false);

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure to give your new set a name, as well as filling out all the question and answer fields.
                </p>
              </Alert>
            );
          }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
        console.log(props.pairCount)
    }

    const emptyFields = () => {
        // Check each field has a value
        for (let [_, value] of Object.entries(inputs)) {
            if (value.trim(" ").length === 0){
                return true;
            }
        }

        return false;
    }

    // Need some extra checks here 
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check that the set has at least a name, 1 pair, and no unmatched pairs
        // As well as no empty values
        if (Object.keys(inputs).length < (1 + (props.pairCount*2)) || emptyFields()){
            setAlert(true);
        } else {
            // Send to database
            console.log(inputs);

            const setResponse = await axios.post("/add_flashcard_set", {name: inputs.set_name, user: localStorage.getItem('user')});

            if (setResponse.data.response === "Success") {
                
                for (let i = 0; i < (Object.keys(inputs).length - 1) / 2; i++) {

                    const flashResponse = await axios.post("/add_flashcard", 
                    {
                        question: inputs[`q_${i}`],
                        answer: inputs[`a_${i}`],
                        user: localStorage.getItem('user'),
                        flashcardsetid: setResponse.data.setid
                    })

                    if (flashResponse.data.response !== "Success") {
                        console.log("Something went wrong adding flashcards...");
                        break;
                    }
                }

            } else {
                console.log("Something went wrong...");
                console.log(setResponse);
             }

            props.getSets();
            props.getFlashcards();
            
            props.setPairCount(1);
            setInputs({});
            props.onHide();
        }
    }

    // Should be fine 
    const handleClose = () => {
        setInputs({});
        props.setPairCount(1);
        props.onHide();
    }

    const createFormEntryPoints = () => {
        return (
            <div id={s.form_pairs}>
                {Array.from(Array(props.pairCount)).map((s, i) => (
                    <Form.Group>
                        <Form.Control
                            // onChange={inputHandler}
                            placeholder="Question:"
                            type="text"
                            id={`q_${i}`}
                            key={`q_${i}`}
                            name={`q_${i}`}
                            onChange={handleChange}
                            maxLength={200}
                        />
                        <Form.Control
                            // onChange={inputHandler}
                            placeholder="Answer:"
                            type="text"
                            id={`a_${i}`}
                            key={`a_${i}`}
                            name={`a_${i}`}
                            onChange={handleChange}
                            maxLength={200}
                        />
                    </Form.Group>
                ))}
            </div>)   
        }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton onClick={props.onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
             Add a new flashcard set
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    // onChange={inputHandler}
                    placeholder="Set name:"
                    type="text"
                    id={s.form_set_name}
                    name="set_name"
                    onChange={handleChange}
                    maxLength={100}
                />
                {createFormEntryPoints()}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.incrementCount}>New pair</Button>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

function ChangeSet(props) {

    const [inputs, setInputs] = useState({});
    const [alert, setAlert] = useState(false);

    const flashcardsInSet = () => props.flashcards ? props.flashcards.filter(flashcard => ([props.currentSet.flashcardsetid])
                                            .flat()
                                            .includes( flashcard.flashcardsets_flashcardsetid )) : undefined;

    useEffect(() => {
        if (props.flashcards && props.currentSet && props.show){ 

            const tempInputs = {name: props.currentSet.name};
            const flashcards = flashcardsInSet();
            flashcards.forEach((flashcard, index) => {
                tempInputs[flashcard.flashcardid] = flashcard;
            });

            setInputs(tempInputs);
            props.setPairCount(0);
        }

    }, [props.show])

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure to fill out all the form fields.
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

    const handleQ = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        const newValue = {...inputs[name]}
        newValue.question = value;
        setInputs(values => ({...values, [name]: newValue}));

        console.log(inputs);
    }

    const handleA = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        const newValue = {...inputs[name]}
        newValue.answer = value;
        setInputs(values => ({...values, [name]: newValue}));

        console.log(inputs);
    }

    const emptyFields = () => {

        // Check set name has a value 
        if ((inputs.name).trim(" ").length === 0) {
            return true;
        }

        // Check each new field has a value
        for (let i = 0; i < props.pairCount; i++) {
            if (!inputs[[`q_${i}`]] || !inputs[`a_${i}`]) {
                return true;
            }
            if (inputs[`q_${i}`].trim(" ").length === 0) {
                return true;
            }
            if (inputs[`a_${i}`].trim(" ").length === 0) {
                return true
            }
        }

        // Check existing fields have values 
        const currentFlashcards = flashcardsInSet();
        for (let index in currentFlashcards) {
            if ((inputs[currentFlashcards[index].flashcardid].question).trim(" ").length === 0) {
                return true;
            }
            if ((inputs[currentFlashcards[index].flashcardid].answer).trim(" ").length === 0) {
                return true;
            }
        }

        return false;
    }

    // Need some extra checks here 
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check that the set has at least a name, 1 pair, and no unmatched pairs
        // As well as no empty values
        if (Object.keys(inputs).length < (1 + (props.pairCount*2) + (flashcardsInSet.length * 2)) 
        || emptyFields()
        ){
            setAlert(true);
        } else {
            // Send to database
            console.log(inputs);

            // Change name
            await axios.post("/change_flashcard_set_name", 
            {
                name: inputs.name,
                flashcardsetid: props.currentSet.flashcardsetid,
                user: localStorage.getItem("user")
            });

            
            // Update current flashcards 
            const currentFlashcards = flashcardsInSet();
            for (let index in currentFlashcards) {
                const flashcard = currentFlashcards[index];
                await axios.post("/change_flashcard",
                {
                    question: inputs[flashcard.flashcardid].question,
                    answer: inputs[flashcard.flashcardid].answer,
                    flashcardid: inputs[flashcard.flashcardid].flashcardid,
                    user: localStorage.getItem('user')
                });
            }


            // Add new flashcards to set
            for (let i = 0; i < (props.pairCount); i++) {

                const flashResponse = await axios.post("/add_flashcard", 
                {
                    question: inputs[`q_${i}`],
                    answer: inputs[`a_${i}`],
                    user: localStorage.getItem('user'),
                    flashcardsetid: props.currentSet.flashcardsetid
                })

                if (flashResponse.data.response !== "Success") {
                    console.log("Something went wrong adding flashcards...");
                    break;
                }
            }

            props.getSets();
            props.getFlashcards();
            
            props.setPairCount(1);
            setInputs({});
            props.onHide();
        }
    }

    // Should be fine 
    const handleClose = () => {
        console.log(inputs);
        setInputs({});
        props.setPairCount(1);
        props.onHide();
    }

    const createExistingEntryPoints = () => {

        if (props.flashcards && props.currentSet && props.show) {
        const flashcards = flashcardsInSet();
        return (
            <div id={s.form_pairs}>
                {flashcards.map((flashcard, i) => (
                    <Form.Group>
                        <Form.Control
                            // onChange={inputHandler}
                            // placeholder="Question:"
                            type="text"
                            id={`q_${i}`}
                            key={`q_${i}`}
                            name={flashcard.flashcardid}
                            onChange={handleQ}
                            value={inputs[flashcard.flashcardid] ? inputs[flashcard.flashcardid].question : undefined}
                            maxLength={200}
                        />
                        <Form.Control
                            // onChange={inputHandler}
                            // placeholder="Answer:"
                            type="text"
                            id={`a_${i}`}
                            key={`a_${i}`}
                            name={flashcard.flashcardid}
                            value={inputs[flashcard.flashcardid] ? inputs[flashcard.flashcardid].answer : undefined}
                            onChange={handleA}
                            maxLength={200}
                        />
                    </Form.Group>
                ))}
            </div>
        )   
        } else {
            return undefined;
        }
    }

    const createFormEntryPoints = () => {
        return (
            <div id={s.form_pairs}>
                {Array.from(Array(props.pairCount)).map((s, i) => (
                    <Form.Group>
                        <Form.Control
                            // onChange={inputHandler}
                            placeholder="Question:"
                            type="text"
                            id={`q_${i}`}
                            key={`q_${i}`}
                            name={`q_${i}`}
                            onChange={handleChange}
                            maxLength={200}
                        />
                        <Form.Control
                            // onChange={inputHandler}
                            placeholder="Answer:"
                            type="text"
                            id={`a_${i}`}
                            key={`a_${i}`}
                            name={`a_${i}`}
                            onChange={handleChange}
                            maxLength={200}
                        />
                    </Form.Group>
                ))}
            </div>)   
        }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
             Edit flashcard set
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    // placeholder={inputs.name}
                    type="text"
                    id={s.form_set_name}
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    maxLength={100}
                />


                {createExistingEntryPoints()}
                {createFormEntryPoints()}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.incrementCount}>Add pair</Button>
            <Button onClick={props.pairCount > 0 ? props.decrementCount : undefined}>Remove pair</Button>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

function ChangeQuizlet(props) {

    const [inputs, setInputs] = useState({});
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        if (props.currentQuizlet && props.show){ 

            const tempInputs = {
                name: props.currentQuizlet.name,
                quizletlink: props.currentQuizlet.quizletlink
            };

            setInputs(tempInputs);
        }

    }, [props.show])

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure to fill out all the form fields.
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


    const emptyFields = () => {

        for (let [_, value] of Object.entries(inputs)) {
            if (value.trim(" ").length === 0){
                return true;
            }
        }

        return false;

    }

    // Need some extra checks here 
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check that the set has at least a name, 1 pair, and no unmatched pairs
        // As well as no empty values
        if (Object.keys(inputs).length < 2 || emptyFields()){
            setAlert(true);
        } else {
            // Send to database
            console.log(inputs);

            // Change name
            await axios.post("/change_quizlet", 
            {
                name: inputs.name,
                quizletlink: inputs.quizletlink,
                quizletid: props.currentQuizlet.quizletid,
                user: localStorage.getItem("user")
            });

            props.getQuizlets()
            
            setInputs({});
            props.onHide();
        }
    }

    // Should be fine 
    const handleClose = () => {

        setInputs({});
        props.onHide();
    }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
             Edit Quizlet set
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    // placeholder={inputs.name}
                    type="text"
                    id={s.form_set_name}
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    maxLength={200}
                />

                <Form.Control
                    // placeholder={inputs.name}
                    type="text"
                    id={s.form_set_name}
                    name="quizletlink"
                    value={inputs.quizletlink}
                    onChange={handleChange}
                    maxLength={500}
                />
                
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

function AddQuizlet(props) {

    const [inputs, setInputs] = useState({});
    const [alert, setAlert] = useState(false);

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure to fill out all the form fields correctly!
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


    const emptyFields = () => {
        // Check each field has a value
        for (let [_, value] of Object.entries(inputs)) {
            if (value.trim(" ").length === 0){
                return true;
            }
        }

        return false;
    }

    // Need some extra checks here 
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check that the set has at least a name, 1 pair, and no unmatched pairs
        // As well as no empty values
        if (Object.keys(inputs).length < 2 || emptyFields()){
            setAlert(true);
        } else {
            // Send to database
            console.log(inputs);

            await axios.post("/add_quizlet", 
            {
                name: inputs.name,

                // We need to process this
                quizletlink: (inputs.quizletlink).replace('style="border:0"', '').replace('width="100%"', 'width="500"'),
                user: localStorage.getItem('user')
            });

            await props.getQuizlets();
            
            setInputs({});
            props.onHide();
        }
    }

    // Should be fine 
    const handleClose = () => {
        setInputs({});
        props.onHide();
    }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton onClick={props.onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
             Add a new quizlet set
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    // onChange={inputHandler}
                    placeholder="Set name:"
                    type="text"
                    id={s.form_pairs}
                    name="name"
                    onChange={handleChange}
                    maxLength={200}
                />
                <Form.Control
                    // onChange={inputHandler}
                    placeholder="Quizlet embed HTML:"
                    type="text"
                    id={s.form_pairs}
                    name="quizletlink"
                    onChange={handleChange}
                    maxLength={500}
                />
                
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

function SelectQuizlet(props) {

    const handleDelete = async () => {
        if ( props.currentQuizlet ) {
            await axios.post('delete_quizlet', 
            {
                quizletid: props.currentQuizlet.quizletid,
                user: localStorage.getItem('user')
            })

            props.getQuizlets();
            props.onHide();
        }
    }

    return (
        <Modal size="lg" show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton onClick={props.onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
             {props.currentQuizlet ? props.currentQuizlet.name : undefined}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
          <div id={sf.flashcard_container}>
            {props.currentQuizlet ? <div dangerouslySetInnerHTML={{__html: props.currentQuizlet.quizletlink}} /> : undefined} 
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button id={s.delete_button} variant="danger" onClick={handleDelete}>Delete</Button>
            <Button onClick={props.changeQuizlet}>Edit</Button>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
    );

}

function Flashcards() {

    // We set these to empty arrays to prevent complaining about 
    // 'cannot read index of undefined' or the like 
    const [sets, setSets] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [currentSet, setCurrentSet] = useState(undefined);
    const [changeSetShow, setChangeSetShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [addCardShow, setAddCardShow] = useState(false);
    const [quizlets, setQuizlets] = useState([]);
    const [addQuizlet, setAddQuizlet] = useState(false);
    const [selectQuizlet, setSelectQuizlet] = useState(false);
    const [changeQuizlet, setChangeQuizlet] = useState(false);
    const [currentQuizlet, setCurrentQuizlet] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState("");

    // This is used to generate the inputs for creating a set
    const [pairCount, setPairCount] = useState(1);

    const navigate = useNavigate();

    // Perfect the way it is
    const inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchTerm(lowerCase);
    }

    // Will need to change to data taken from database 
    const filteredData = sets.filter((set) => {
        //if no input the return the original
        if (searchTerm === '') {
            return set;
        }
        //return the item which contains the user input
        else {
            if (set.name !== null) {
                return set.name.toLowerCase().includes(searchTerm)
            }
        }
    })

    const filteredQuizlets = quizlets.filter((set) => {
        //if no input the return the original
        if (searchTerm === '') {
            return set;
        }
        //return the item which contains the user input
        else {
            if (set.name !== null) {
                return set.name.toLowerCase().includes(searchTerm)
            }
        }
    })

    const getSets = async () => {
        const response = await axios.post("/get_flashcard_sets", {user: localStorage.getItem('user')});

        if (response.data.response === "Success") {
            setSets(response.data.sets);
        } else {
            console.log("Something went wrong...")
            console.log(response);
        }
    }

    const getFlashcards = async () => {
        const response = await axios.post("/get_flashcards", {user: localStorage.getItem('user')});

        if (response.data.response === "Success") {
            setFlashcards(response.data.flashcards);
        } else {
            console.log("Something went wrong...")
            console.log(response);
        }
    }

    const getQuizlets = async () => {
        const response = await axios.post("/get_quizlets", {user: localStorage.getItem('user')});

        if (response.data.response === "Success") {
            setQuizlets(response.data.quizlets);
        } else {
            console.log("Something went wrong...")
            console.log(response);
        }
    }

    // Runs when function is called initially 
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (!auth) {
            navigate('/olsa/landing-page');
        }
        getSets();
        getFlashcards();
        getQuizlets();
    }, [])

    return (
        <main>  
            <div className={s.background_1}>
                <NavbarIn></NavbarIn>
            
                <div id={s.title_container}>
                    <h1 id={s.title}>Flashcards</h1>
                </div>

                <div id={s.controls}>
                    <Form.Control
                        onChange={inputHandler}
                        placeholder="Filter:"
                        outline='primary'
                        type="text"
                        id={s.search_bar}
                    />
                    <Button id={s.control_button} onClick={() => setAddCardShow(true)}>Add new set</Button>
                    <Button id={s.control_button} onClick={() => setAddQuizlet(true)}>Add Quizlet set</Button>
                </div>

                <div id={s.main_content_container}>

                    {/* Display quizlets  */}
                    {filteredQuizlets.map(set => (
                        <Card 
                            onClick={() => {
                                setCurrentQuizlet(set);
                                setSelectQuizlet(true);
                            }
                            } 
                            className={s.auto_cards} 
                            key={set.quizletid}>
                            {/* <Card.Img variant="top" src={pictureFrame} /> */}
                            <Card.Body className={s.card_content_container}>
                                {/* <Button id={s.edit_button} variant='light'>Edit</Button> */}
                                <Card.Title id={s.set_name} >{set.name}</Card.Title>
                                <Card.Subtitle id={s.set_count}>Quizlet</Card.Subtitle>
                            </Card.Body>
                        </Card>
                    ))}

                    {/* Display sets  */}
                    {filteredData.map(set => (
                        <Card 
                            onClick={() => {
                                setCurrentSet(set);
                                setModalShow(true);
                            }
                            } 
                            className={s.auto_cards} 
                            key={set.flashcardsetid}>
                            {/* <Card.Img variant="top" src={pictureFrame} /> */}
                            <Card.Body className={s.card_content_container}>
                                {/* <Button id={s.edit_button} variant='light'>Edit</Button> */}
                                <Card.Title id={s.set_name} >{set.name}</Card.Title>
                                <Card.Subtitle id={s.set_count}>

                                    {/* This should be put into a function to get the term(s) correct */}
                                    {flashcards.filter(flashcard => ([set.flashcardsetid])
                                               .flat()
                                               .includes( flashcard.flashcardsets_flashcardsetid ))
                                               .length} term(s)
                                </Card.Subtitle>
                            </Card.Body>
                        </Card>
                    ))}
                   
                </div>

                <div className={s.footer}>
                  <p>Copyright @ 2024 OLSA Inc</p>
                  <p>dk94@st-andrews.ac.uk</p>
                  <p>Made with React</p>
                </div>
            </div>

            <SelectSet 
                show={modalShow} 
                onHide={() => setModalShow(false)}
                currentSet={currentSet}
                flashcards={flashcards}
                changeSet={() => {
                    setModalShow(false);
                    setChangeSetShow(true);
                }}
                getSets={getSets}
                getFlashcards={getFlashcards}
            ></SelectSet>

            <ChangeSet 
                show={changeSetShow}
                onHide={() => {
                    setChangeSetShow(false);
                    // setModalShow(true);
                }}
                currentSet={currentSet}
                flashcards={flashcards}
                pairCount={pairCount}
                setPairCount={setPairCount}
                incrementCount={() => setPairCount(pairCount+1)}
                decrementCount={() => setPairCount(pairCount-1)}
                getSets={getSets}
                getFlashcards={getFlashcards}

            ></ChangeSet>

            <AddSet 
                show={addCardShow} 
                onHide={() => setAddCardShow(false)} 
                pairCount={pairCount}
                setPairCount={setPairCount}
                incrementCount={() => setPairCount(pairCount+1)}
                getSets={getSets}
                getFlashcards={getFlashcards}
            ></AddSet>

            <AddQuizlet 
                show={addQuizlet}
                onHide={() => setAddQuizlet(false)}
                getQuizlets={getQuizlets}
            ></AddQuizlet>

            <SelectQuizlet
                show={selectQuizlet}
                onHide={() => setSelectQuizlet(false)}
                getQuizlets={getQuizlets}
                currentQuizlet={currentQuizlet}
                changeQuizlet={() => {
                    setSelectQuizlet(false);
                    setChangeQuizlet(true);
                }}
            ></SelectQuizlet>

            <ChangeQuizlet 
                show={changeQuizlet}
                onHide={() => {
                    setChangeQuizlet(false);
                    // setSelectQuizlet(true);
                }}
                getQuizlets={getQuizlets}
                currentQuizlet={currentQuizlet}
            ></ChangeQuizlet>

        </main>
    )
}

export default Flashcards;