import React, { useEffect, useState } from 'react';
import TextEditor from "../../Components/TextEditor/TextEditor";
import NavbarIn from "../../Components/NavBarIn/NavBarIn";
import s from './Notes.module.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import notepad from './../../Assets/notepad.png';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';


function SelectNote(props) {

    // We have note id, name, and content in props 
    const [alert, setAlert] = useState(false);
    const [inputs, setInputs] = useState(props.noteName);
    const [content, setContent] = useState(props.initialValue);

    const handleTextChange = (content) => {
        setContent(content);
    }

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure to give your note a name!
                </p>
              </Alert>
            );
          }
    }

    const handleChange = (event) => {
        const value = event.target.value;
        setInputs(value);
    }

    // const emptyFields = () => {
    //     // Check each field has a value
    //     if (inputs.length === 0){
    //         return true;
    //     }

    //     return false;
    // }

    const handleDelete = async () => {

        deleteNote();
        props.onHide();
    }

    const deleteNote = async () => {
        const response = await axios.post("/delete_note", {noteid: props.noteid, user: localStorage.getItem('user')});

        if (response.data.response === "Success") {
            console.log("Success");
            // Get new notes array and update state 
            props.setNotes(response.data.notes);

        } else {
            console.log(response);
        }

    }

    const updateNote = async () => {
        const newName = (inputs ? inputs : props.noteName);
        const newContent = (content ? content : props.initialValue);
        const response = await axios.post('/update_notes', 
            {noteid: props.noteid, name: newName, content: newContent, user: localStorage.getItem('user')}
        );

        if (response.data.response === "Success") {
            console.log("Success");
            // Get new notes array and update state 
            props.setNotes(response.data.notes);

        } else if (response.data.response === "Failure") {
            console.log("Failure");
            // Alert user something went wrong with inputting their new note 
        } else {
            console.log(response);
        }
    }

    const handleClose = (event) => {
        event.preventDefault();

        // Check that the set has at least a name, 1 pair, and no unmatched pairs
        // As well as no empty values
        if (
            // emptyFields()
            false
        ){
            setAlert(true);
        } else {
            
            updateNote();
            setInputs(undefined);
            props.onHide();
        }
    }

    return (
        <Modal size='lg' show={props.show} aria-labelledby="contained-modal-title-vcenter" id={s.editor_modal} dialogClassName="modal_50w">
          <Modal.Header 
          >
            <Modal.Title id="contained-modal-title-vcenter">
                <AlertDismissible/>
                <Form.Control
                    id={s.note_name}
                    name='title'
                    type='text'
                    placeholder={props.noteName}
                    onChange={handleChange}
                    maxLength={100}
                />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <TextEditor initialValue={props.initialValue} handleChange={handleTextChange}></TextEditor>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" id={s.delete_note} onClick={handleDelete}>Delete</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );

}

function AddNote(props) {

    const [alert, setAlert] = useState(false);
    const [content, setContent] = useState("");
    const [inputs, setInputs] = useState("New note");

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure to give your note a name!
                </p>
              </Alert>
            );
          }
    }

    const handleTextChange = (content) => {
        setContent(content);
    }

    const handleChange = (event) => {
        const value = event.target.value;
        setInputs(value);
    }

    const sendNewNote = async () => {
        const response = await axios.post('/add_note', {name: inputs, content: content, user: localStorage.getItem('user')});

        if (response.data.response === "Success") {
            console.log("Success");
            // Get new notes array and update state 
            props.setNotes(response.data.notes);

        } else if (response.data.response === "Failure") {
            console.log("Failure");
            // Alert user something went wrong with inputting their new note 
        } else {
            console.log(response);
        }
    }

    const handleClose = () => {
        setContent("");
        setInputs("New note");
        props.onHide();
    }

    const handleSaveAndClose = () => {
        sendNewNote();
        setContent("");
        setInputs("New note");
        props.onHide();
    }

    return (
        <Modal size='lg' show={props.show} aria-labelledby="contained-modal-title-vcenter" id={s.editor_modal} dialogClassName="modal_50w">
          <Modal.Header 
            //   closeButton onClick={handleClose}
          >
            <Modal.Title id="contained-modal-title-vcenter">
                <AlertDismissible/>
                <Form.Control
                    id={s.note_name}
                    name='title'
                    type='text'
                    placeholder="New note"
                    onChange={handleChange}
                    maxLength={100}
                />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <TextEditor handleChange={handleTextChange}></TextEditor>
          </Modal.Body>
          <Modal.Footer>
            <Button id={s.delete_note} variant="danger" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSaveAndClose}>Save & Close</Button>
          </Modal.Footer>
        </Modal>
    );

}

function AddGoogleDoc(props) {

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

            await axios.post("/add_google_doc", 
            {
                name: inputs.name,

                // We need to process this
                googledoclink: `<iframe width="100%" height="100% "src="${inputs.googledoclink}&embedded=true"></iframe>`,
                user: localStorage.getItem('user')
            });

            await props.fetchGoogleDocs();
            
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
             Add a new Google Doc
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    // onChange={inputHandler}
                    placeholder="Document name:"
                    type="text"
                    id={s.form_set_name}
                    name="name"
                    onChange={handleChange}
                    maxLength={200}
                />
                <Form.Control
                    // onChange={inputHandler}
                    placeholder="Google Docs share link:"
                    type="text"
                    id={s.form_pairs}
                    name="googledoclink"
                    onChange={handleChange}
                    maxLength={500}
                />
                <p id={s.google_docs_notice}>Note: editing Google Docs on mobile devices is currently not possible, due to 
                limitations encountered as a result of the university's nginx CSP ruleset.</p>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

function SelectGoogleDoc(props) {

    const handleDelete = async () => {
        if ( props.currentGoogleDoc ) {
            await axios.post('delete_google_doc', 
            {
                googledocid: props.currentGoogleDoc.googledocid,
                user: localStorage.getItem('user')
            })

            props.fetchGoogleDocs();
            props.onHide();
        }
    }

    return (
        <Modal contentClassName='select_google_doc' size="xl" show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton onClick={props.onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
             {props.currentGoogleDoc ? props.currentGoogleDoc.name : undefined}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example" >
          <p id={s.google_docs_notice_in_doc}>Note: editing Google Docs on mobile devices is currently not possible, due to 
                the university's nginx CSP ruleset.</p>
            {props.currentGoogleDoc ? <div id={s.google_doc} dangerouslySetInnerHTML={{__html: props.currentGoogleDoc.googledoclink}} /> : undefined} 
          </Modal.Body>
          <Modal.Footer>
            <Button id={s.delete_button} variant="danger" onClick={handleDelete}>Delete</Button>
            <Button onClick={props.changeGoogleDoc}>Edit</Button>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
    );

}

function ChangeGoogleDoc(props) {

    const [inputs, setInputs] = useState({});
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        if (props.currentGoogleDoc && props.show){ 

            const tempInputs = {
                name: props.currentGoogleDoc.name,
                googledoclink: props.currentGoogleDoc.googledoclink
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
            await axios.post("/change_google_doc", 
            {
                name: inputs.name,
                googledoclink: inputs.googledoclink,
                googledocid: props.currentGoogleDoc.googledocid,
                user: localStorage.getItem("user")
            });

            props.fetchGoogleDocs()


            
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
             Edit Google Doc
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Google Doc share link"
                    className="mb-3"
                >
                    <Form.Control
                        // placeholder={inputs.name}
                        type="text"
                        id={s.form_googledocname}
                        name="name"
                        value={inputs.name}
                        onChange={handleChange}
                        maxLength={200}
                    />
                </FloatingLabel>

                <FloatingLabel
                    controlId="floatingInput"
                    label="Google Doc share link"
                    className="mb-3"
                >
                    <Form.Control
                        // placeholder={inputs.name}
                        type="text"
                        id={s.form_googledoclink}
                        name="googledoclink"
                        value={inputs.googledoclink}
                        onChange={handleChange}
                        maxLength={500}
                    />
                </FloatingLabel>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}


export default function Notes() {

    const [modalShow, setModalShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [addNoteShow, setAddNoteShow] = useState(false);
    const [addGoogleDoc, setAddGoogleDoc] = useState(false);
    const [selectGoogleDoc, setSelectGoogleDoc] = useState(false);
    const [notes, setNotes] = useState([]);
    const [googleDocs, setGoogleDocs] = useState([]);
    const [currentNote, setCurrentNote] = useState(undefined);
    const [currentGoogleDoc, setCurrentGoogleDoc] = useState(undefined);
    const [changeGoogleDoc, setChangeGoogleDoc] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (!auth) {
            navigate('/olsa/landing-page');
        }

        fetchNotes();
        fetchGoogleDocs();
    }, [navigate])

    // To do 
    const fetchNotes = async () => {
        const response = await axios.post('/get_notes', {user: localStorage.getItem('user')});

        if (response.data.response === "Success") {
            setNotes(response.data.notes);
        } else if (response.data.response === "Server failure") {
            // Alert user
            console.log("Something went wrong...")
        } else {
            console.log("Received other response...");
        }
    }

    const fetchGoogleDocs = async() => {
        const response = await axios.post('/get_google_docs', {user: localStorage.getItem('user')});

        if (response.data.response === "Success") {
            setGoogleDocs(response.data.googledocs);
        } else if (response.data.response === "Server failure") {
            // Alert user
            console.log("Something went wrong fetching Google Docs...")
        } else {
            console.log("Received other response...");
        }
    }

    const inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchTerm(lowerCase);
    }

    const filteredData = notes.filter((el) => {
        //if no input the return the original
        if (searchTerm === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.name.toLowerCase().includes(searchTerm)
        }
    })

    const filteredDocs = googleDocs.filter((el) => {
        //if no input the return the original
        if (searchTerm === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.name.toLowerCase().includes(searchTerm)
        }
    })

    const getInitialValue = () => {
        for (let i in notes) {
            if (notes[i].noteid === currentNote) {
                return notes[i].content;
            }
        }
    }
    
    const getNoteName = () => {
        for (let i in notes) {
            if (notes[i].noteid === currentNote) {
                return notes[i].name
            }
        }
    }

    return(
        
        <main>  
            <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' https://apis.google.com/"></meta>
            <div className={s.background_1}>
                <NavbarIn></NavbarIn>
            
                <div id={s.title_container}>
                    <h1 id={s.title}>Notes</h1>
                </div>

                <div id={s.controls}>
                    <Form.Control
                        onChange={inputHandler}
                        placeholder="Filter:"
                        type="text"
                        id={s.search_bar}
                    />
                    <Button id={s.control_button} onClick={() => setAddNoteShow(true)}>Add new note</Button>
                    <Button id={s.control_button} onClick={() => setAddGoogleDoc(true)}>Add Google Doc</Button>
                </div>

                <div id={s.main_content_container}>
                    {filteredData.map(item => (
                            <Card 
                                onClick={() => {
                                    setCurrentNote(item.noteid)
                                    setModalShow(true);
                                }} 
                                className={s.auto_cards} 
                                key={item.noteid}
                            >
                                <Card.Img variant="top" src={notepad} />
                                <Card.Body className={s.card_content_container}>
                                    {/* <Button id={s.edit_button} variant='light'>Edit</Button> */}
                                    <Card.Title id={s.set_name}>{item.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        ))}
                        {filteredDocs.map(item => (
                            <Card 
                                onClick={() => {
                                    setCurrentGoogleDoc(item)
                                    setSelectGoogleDoc(true);
                                }} 
                                className={s.auto_cards} 
                                key={item.googledocid}
                            >
                                <Card.Img variant="top" src={notepad} />
                                <Card.Body className={s.card_content_container}>
                                    {/* <Button id={s.edit_button} variant='light'>Edit</Button> */}
                                    <Card.Title id={s.set_name}>{item.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        ))}
                </div>

                <SelectNote 
                    show={modalShow} 
                    onHide={() => setModalShow(false)} 
                    noteid={currentNote}
                    initialValue={getInitialValue()}
                    noteName={getNoteName()}
                    setNotes={(arg) => setNotes(arg)}
                ></SelectNote>

                <AddNote 
                    show={addNoteShow} 
                    onHide={() => setAddNoteShow(false)}
                    setNotes={(arg) => setNotes(arg)}
                ></AddNote>

                <AddGoogleDoc
                    show={addGoogleDoc}
                    onHide={() => setAddGoogleDoc(false)}
                    fetchGoogleDocs={fetchGoogleDocs}
                ></AddGoogleDoc>

                <SelectGoogleDoc 
                    show={selectGoogleDoc}
                    onHide={() => setSelectGoogleDoc(false)}
                    currentGoogleDoc={currentGoogleDoc}
                    changeGoogleDoc={() => {
                        setSelectGoogleDoc(false);
                        setChangeGoogleDoc(true);
                    }}
                    fetchGoogleDocs={fetchGoogleDocs}
                ></SelectGoogleDoc>

                <ChangeGoogleDoc
                    show={changeGoogleDoc}
                    onHide={() => {
                        setChangeGoogleDoc(false);
                        // setCurrentGoogleDoc(currentGoogleDoc);
                        // setSelectGoogleDoc(true);
                    }}
                    currentGoogleDoc={currentGoogleDoc}
                    fetchGoogleDocs={fetchGoogleDocs}
                ></ChangeGoogleDoc>
        
                <div className={s.footer}>
                  <p>Copyright @ 2024 OLSA Inc</p>
                  <p>dk94@st-andrews.ac.uk</p>
                  <p>Made with React</p>
                </div>
            </div>
        </main>
    )
}