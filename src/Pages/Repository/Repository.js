import { useState } from 'react';
import NavbarIn from '../../Components/NavBarIn/NavBarIn';
import s from './RepositoryStyle.module.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from './../../Assets/up-arrow.png';
import ExpandMore from './../../Assets/down-arrow.png';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import EditImage from './../../Assets/dots.png';
import PencilImage from './../../Assets/pencil.png';
import axios from 'axios';
axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';

function AddLink(props) {

    // Default value of 0 for selector group index
    const [inputs, setInputs] = useState({"group": 0});
    const [alert, setAlert] = useState(false);

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure that your new item has a name and a valid url!
                </p>
              </Alert>
            );
          }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
        console.log(inputs);
    }


    const emptyFields = () => {
        // Check each field has a value
        for (let [_, value] of Object.entries(inputs)) {
            if (typeof(value) === String && value.trim(" ").length === 0){
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
        if (Object.keys(inputs).length < 2 
        || emptyFields()
        || (!(inputs['link'].indexOf("http://") === 0) && !(inputs['link'].indexOf("https://") === 0))
        ){
            setAlert(true);
        } else {

            // Development
            console.log(inputs);

            await axios.post('/add_link', 
            {
                name: inputs.name,
                url: inputs.link,
                user: localStorage.getItem('user'),
                linkgroupid: props.linkgroups[inputs.group].linkgroupid
            })

            setInputs({"group": 0});

            props.getLinks();
            props.getLinkgroups();
            props.onHide();
        }
    }

    // Should be fine 
    const handleClose = () => {
        setInputs({"group": 0});
        props.onHide();
    }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton onClick={props.onHide}>
            <Modal.Title id="contained-modal-title-vcenter">
             Add a new link
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Group id={s.form_pairs}>
                    <Form.Control
                        // onChange={inputHandler}
                        placeholder="Display name:"
                        type="text"
                        name="name"
                        onChange={handleChange}
                        maxLength={100}
                    />
                    <Form.Control
                        // onChange={inputHandler}
                        placeholder="Link:"
                        type="text"
                        name="link"
                        onChange={handleChange}
                        maxLength={200}
                    />
                    <Form.Select
                        name='group'
                        onChange={handleChange}
                    >
                        {props.linkgroups.map((group, index) => (
                            <option
                                name='group'
                                value={index}
                                onChange={handleChange}
                            >
                                {group.name}
                            </option> 
                        ))}
                    </Form.Select>
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

function EditLink(props) {

    // Default value of 0 for selector group index
    const [inputs, setInputs] = useState({"group": 0});
    const [alert, setAlert] = useState(false);

    // Populate the fields of inputs on load
    useEffect(() => {
        // props.setCurrentLink({...props.currentLink});
        if (props.currentLink !== undefined) {
            const inputsClone = inputs;
            inputsClone.name = props.currentLink.name;
            inputsClone.link = props.currentLink.url;
            inputsClone.group = props.currentLink.linkgroups_linkgroupid;

            setInputs({...inputsClone});
        }
    }, [props.currentLink])

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure that your item has a name and a valid url!
                </p>
              </Alert>
            );
          }
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
        console.log(inputs);
    }

    const emptyFields = () => {
        // Check each field has a value
        for (let [_, value] of Object.entries(inputs)) {
            if (typeof(value) === String && value.trim(" ").length === 0){
                return true;
            }
        }

        return false;
    }

    // Need some extra checks here 
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check that the link has a name, url, group
        // As well as no empty values
        if (Object.keys(inputs).length < 3
        || emptyFields()
        || (!(inputs['link'].indexOf("http://") === 0) && !(inputs['link'].indexOf("https://") === 0))
        ){
            setAlert(true);
        } else {

            // Development
            console.log(inputs);

            await axios.post('/change_link', 
            {
                name: inputs.name,
                url: inputs.link,
                group: inputs.group,
                user: localStorage.getItem('user'),
                linkid: props.currentLink.linkid 
            })

            setInputs({"group": 0});

            await props.getLinks();
            await props.getLinkgroups();

            props.setCurrentLink(undefined);
            props.onHide();
        }
    }

    const handleDelete = async () => {
        const response = await axios.post('delete_link', 
        {
            linkid: props.currentLink.linkid,
            user: localStorage.getItem('user')
        })

        if (response !== "Success") {
            console.log("Something went wrong while trying to delete the link...");
        }

        await props.getLinks();
        await props.getLinkgroups();

        setInputs({});
        props.onHide();
    }

    // Should be fine 
    const handleClose = () => {
        setInputs({"group": 0});

        props.setCurrentLink(undefined);
        props.onHide();
    }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton onClick={handleClose}>
            <Modal.Title id="contained-modal-title-vcenter">
             Edit link
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Group id={s.form_pairs}>
                    <Form.Control
                        // onChange={inputHandler}
                        type="text"
                        name="name"
                        value={inputs.name}
                        onChange={handleChange}
                        maxLength={100}
                    />
                    <Form.Control
                        // onChange={inputHandler}
                        type="text"
                        name="link"
                        value={inputs.link}
                        onChange={handleChange}
                        maxLength={200}
                    />
                    <Form.Select
                        name='group'
                        defaultValue={props.currentLink ? props.currentLink.linkgroups_linkgroupid : undefined}
                        onChange={handleChange}
                    >
                        {props.linkgroups.map((group, index) => (
                            <option
                                name='group'
                                value={group.linkgroupid}
                                onChange={handleChange}
                            >
                                {group.name}
                            </option> 
                        ))}
                    </Form.Select>
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button id={s.delete_group} variant="danger" onClick={handleDelete}>Delete</Button>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

function AddGroup(props) {

    // Default value of 0 for selector group index
    const [inputs, setInputs] = useState({});
    const [alert, setAlert] = useState(false);

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure that your group has a name!
                </p>
              </Alert>
            );
          }
    }

    // Populate the fields of inputs on load
    useEffect(() => {
        // props.setCurrentLink({...props.currentLink});
        if (props.currentLink !== undefined) {
            const inputsClone = inputs;
            inputsClone.name = props.currentLink.name;
            inputsClone.link = props.currentLink.url;
            inputsClone.group = props.currentLink.linkgroups_linkgroupid;

            setInputs({...inputsClone});
        }
    }, [props.currentLink])

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
        console.log(inputs);
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
        if (Object.keys(inputs).length < 1 || emptyFields()){
            setAlert(true);
        } else {

            // Development
            console.log(inputs);

            await axios.post('/add_linkgroup', 
            {
                name: inputs.name,
                user: localStorage.getItem('user')
            });

            props.getLinks();
            props.getLinkgroups();
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
             Add a new group
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Group id={s.form_pairs}>
                    <Form.Control
                        // onChange={inputHandler}
                        placeholder="Group name:"
                        type="text"
                        name="name"
                        onChange={handleChange}
                        maxLength={100}
                    />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

function EditGroup(props) {

    // Default value of 0 for selector group index
    const [inputs, setInputs] = useState({});
    const [alert, setAlert] = useState(false);

    const AlertDismissible = () => {
        if (alert) {
            return (
              <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  Make sure that your group has a name!
                </p>
              </Alert>
            );
          }
    }

    // Populate the fields of inputs on load
    useEffect(() => {
        // props.setCurrentLink({...props.currentLink});
        if (props.currentGroup !== undefined) {
            const inputsClone = inputs;
            inputsClone.name = props.currentGroup.name;

            setInputs({...inputsClone});
        }
    }, [props.currentGroup])

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
        console.log(inputs);
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
        if (Object.keys(inputs).length < 1 || emptyFields()){
            setAlert(true);
        } else {

            // Development
            console.log(inputs);

            await axios.post('/change_linkgroup_name', 
            {
                name: inputs.name,
                linkgroupid: props.currentGroup.linkgroupid,
                user: localStorage.getItem('user')
            });

            await props.getLinks();
            await props.getLinkgroups();

            props.onHide();
        }
    }

    const handleDelete = async (event) => {
        event.preventDefault();

        const response = await axios.post("/delete_linkgroup", 
        {
            linkgroupid: props.currentGroup.linkgroupid,
            user: localStorage.getItem('user')
        })

        if (response.data.response !== "Success") {
            console.log("Something went wrong while attempting to delete the group...");
        }

        await props.getLinks();
        await props.getLinkgroups();

        setInputs({});
        props.onHide();
    }

    // Should be fine 
    const handleClose = () => {
        setInputs({});
        props.onHide();
    }

    return (
        <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
          <Modal.Header closeButton onClick={handleClose}>
            <Modal.Title id="contained-modal-title-vcenter">
             Edit group
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="grid-example">
            <AlertDismissible />
            <Form onSubmit={handleSubmit}>
                <Form.Group id={s.form_pairs}>
                    <Form.Control
                        // onChange={inputHandler}
                        type="text"
                        name="name"
                        value={inputs.name}
                        onChange={handleChange}
                        maxLength={100}
                    />
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button id={s.delete_group} variant='danger' onClick={handleDelete}>Delete</Button>
            <Button onClick={handleSubmit}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
    );
}

export default function Repository() {

    const [searchTerm, setSearchTerm] = useState("");
    const [addLink, setAddLink] = useState(false);
    const [editLink, setEditLink] = useState(false);
    const [editGroup, setEditGroup] = useState(false);
    const [addGroup, setAddGroup] = useState(false);
    const [open, setOpen] = useState({});
    const [links, setLinks] = useState([]);
    const [currentLink, setCurrentLink] = useState(links[0]);
    const [currentGroup, setCurrentGroup] = useState(undefined);
    const [linkgroups, setLinkgroups] = useState([]);
    const navigate = useNavigate();

    const getLinkgroups = async () => {
        const response = await axios.post('/get_linkgroups', 
        {
            user: localStorage.getItem('user')
        })

        response.data.response === "Success" ? setLinkgroups(response.data.linkgroups) 
                                             : console.log("Something went wrong fetching user groups...");
    }

    const getLinks = async () => {
        const response = await axios.post('/get_links', 
        {
            user: localStorage.getItem('user')
        })

        response.data.response === "Success" ? setLinks(response.data.links) 
                                             : console.log("Something went wrong fetching user links...");
    }

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (!auth) {
            navigate('/olsa/landing-page');
        }
  
        // Get groups and items 
        getLinkgroups();
        getLinks();
    }, []);

    const handleClick = (index) => {
        setOpen(values => ({...values, [index]: !values[index]}));
        console.log(open);
    }

    const filteredData = linkgroups.filter((el) => {
        //if no input the return the original
        if (searchTerm === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.name.toLowerCase().includes(searchTerm)
        }
    })

    // Takes input text, converts to lowercase, sets the search term state 
    const inputHandler = (e) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchTerm(lowerCase);
    }

    return (
        <main>  
            <div className={s.background_1}>
                <NavbarIn></NavbarIn>
            
                <div id={s.title_container}>
                    <h1 id={s.title}>Link Repository</h1>
                </div>

                <div id={s.controls}>
                    <Form.Control
                        onChange={inputHandler}
                        placeholder="Filter by group:"
                        type="text"
                        id={s.search_bar}
                    />
                    <div id={s.control_buttons}>
                        <Button id={s.new_link} onClick={() => {setAddLink(true)}}>Add new link</Button>
                        <Button id={s.new_group} onClick={() => {setAddGroup(true)}}>Add new group</Button>
                    </div>
                </div>

                <div id={s.main_content_container}>

                { linkgroups.length > 0 ? 
                    <Card border='none'>
                    <List
                        id={s.list}
                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                        component="nav"
                        className={s.rounded_border}
                    >
                            {filteredData.map((linkgroup, index) => (
                                <>
                                    <div id={s.group_container}>
                                        <img 
                                            id={s.edit_group_image}
                                            src={PencilImage}
                                            onClick={() => {
                                                setCurrentGroup(linkgroup);
                                                setEditGroup(true);
                                            }}
                                            alt='Edit button'
                                        />
                                        <ListItemButton 
                                            id={s.list_item}
                                            className={s.rounded_border}
                                            onClick={() => handleClick(index)}
                                        >
                                            <ListItemText 
                                                primary={linkgroup.name}
                                                secondary={`${links.filter(link => ([linkgroup.linkgroupid]).flat()
                                                                                                        .includes( link.linkgroups_linkgroupid ))
                                                                                                        .length} item(s)`}
                                            />
                                            {open[index] ? <img id={s.group_icon} src={ExpandLess} alt=''/> 
                                                        : <img id={s.group_icon} src={ExpandMore} alt=''/>}
                                        </ListItemButton>
                                    </div>

                                    <Collapse 
                                    in={open[index]} 
                                    timeout="auto" 
                                    unmountOnExit
                                    >
                                        {links.filter(link => ([linkgroup.linkgroupid]).flat().includes( link.linkgroups_linkgroupid )).map((link, index) => (
                                            <List 
                                            component="div" 
                                            disablePadding
                                            id={s.linkgroup}
                                            >
                                                
                                                <ListItem
                                                sx={{ pl: 4 }}
                                                className={s.rounded_border}
                                                id={s.list_item}
                                                >
                                                    {/* Change these to icon for edit, and go */}

                                                    <img 
                                                        id={s.edit_image}
                                                        src={EditImage}
                                                        onClick={() => {
                                                            setCurrentLink(link);
                                                            setEditLink(true);
                                                        }}
                                                        alt='Edit button'
                                                    />

                                                    <ListItemText primary={link.name} id={s.link_name}/>

                                                    <Button 
                                                        id={s.go_button}
                                                        href={`${link.url}`} 
                                                        target='_blank' 
                                                    >Go</Button>

                                                </ListItem>

                                            </List>
                                        ))}
                                    </Collapse>
                                </>
                            ))}
                    </List>

                    </Card>
                    : undefined }
                </div>
                <div className={s.footer}>
                  <p>Copyright @ 2024 OLSA Inc</p>
                  <p>dk94@st-andrews.ac.uk</p>
                  <p>Made with React</p>
                </div>
            </div>

            <AddLink 
                show={addLink} 
                onHide={() => setAddLink(false)} 
                linkgroups={linkgroups}
                getLinks={getLinks}
                getLinkgroups={getLinkgroups}
            ></AddLink>

            <EditLink 
                show={editLink} 
                onHide={() => setEditLink(false)} 
                linkgroups={linkgroups}
                currentLink={currentLink}
                setCurrentLink={setCurrentLink}
                getLinks={getLinks}
                getLinkgroups={getLinkgroups}
            ></EditLink>

            <AddGroup 
                show={addGroup}
                onHide={() => setAddGroup(false)}
                getLinks={getLinks}
                getLinkgroups={getLinkgroups}
            ></AddGroup>
        
            <EditGroup  
                show={editGroup}
                onHide={() => setEditGroup(false)}
                currentGroup={currentGroup}
                getLinks={getLinks}
                getLinkgroups={getLinkgroups}
            ></EditGroup>
            
        </main>
        
    );
}