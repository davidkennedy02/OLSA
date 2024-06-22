import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Card from 'react-bootstrap/Card';
import s from './KanbanStyle.module.css'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import axios from 'axios';
axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';


/**
 * Reorders a list in the case of elements being reordered
 * @param {*} list 
 * @param {*} startIndex 
 * @param {*} endIndex 
 * @returns 
 */
const reorder = (list, startIndex, endIndex) => {

  console.log(list);
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // We want to be able to remove the flickering by changing the position, 
  // setting the state, and then updating the database

  for (let index in result) {
    result[index].position = index;
  }

  return result;
};


/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination, groups) => {

  // A clone of the source column
  const sourceClone = Array.from(source);

  // A clone of the destination column
  const destClone = Array.from(destination);

  // Removes the item to move from the source clone, and store the result in removed 
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  // Update the positions and groups in the source clone 
  for (let index in sourceClone) {
    sourceClone[index].position = index;
  }

  // Update the positions in the destination clone 
  for (let index in destClone) {
    destClone[index].position = index;
    destClone[index].itemgroups_groupid = groups[droppableDestination.droppableId].itemgroupid;
  }

  // Return the changed lists in result
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};


const grid = 8;


const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
//   background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

/**
 * Display the modal needed to allow a user to both view and change card content
 * @param {A dictionary that contains all the parameters needed for the function} props 
 * @returns 
 */
function ChangeCard(props) {

  const [inputs, setInputs] = useState(props.currentCard);
  const [alert, setAlert] = useState(false);

  // Sets the values of the form depending on the card selected
  useEffect(() => {
    setInputs(props.currentCard);
  }, [props.currentCard])

  const AlertDismissible = () => {
      if (alert) {
          return (
            <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                Make sure to fill out all form fields correctly!
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

  // Need some extra checks here 
  const handleSubmit = async (event) => {
      event.preventDefault();

      // console.log(inputs);
      // console.log(props.currentCard);

      if (inputs.startdate > inputs.enddate) {
        setAlert(true);
      } else {

        await axios.post('/change_item', 
        {
          title: inputs.title, 
          content: inputs.content, 
          startdate: inputs.startdate.split("T")[0], 
          enddate: inputs.enddate.split("T")[0], 
          user: localStorage.getItem('user'), 
          itemid: inputs.itemid
        });

        await props.getItems();

        // setInputs({});
        
        props.onHide();
      }
  }

  // Should be fine 
  const handleClose = () => {
    console.log(inputs);
    console.log(inputs.startdate);

    setInputs(props.currentCard);
    props.onHide();
  }

  // Will have to find the card in the array 
  const handleDelete = async () => {
    console.log(props.currentCard);

    const response = await axios.post("/delete_item", {itemid: props.currentCard.itemid, user: localStorage.getItem('user')});
    if (response.data.response !== "Success") {
      console.log("Something went wrong...");
    }

    props.getItems();
    setInputs({});
    props.onHide();
  }

  return (
      <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title id="contained-modal-title-vcenter">
           View / edit item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <AlertDismissible />
          <Form onSubmit={handleSubmit}>
              <Form.Group id={s.form_pairs}>
                  {/* Title of card */}
                  <Form.Control
                      // placeholder={props.currentCard.title}
                      type="text"
                      name="title"
                      onChange={handleChange}
                      value={inputs.title}
                      maxLength={200}
                  />

                  {/* Content of card - for reading purposes only */}
                  <Form.Control
                      // placeholder="What if i do something reaaaaaaaaaaaaaaaaaaaaaaaaaaaaaally long"
                      type="text"
                      as="textarea"
                      rows={5}
                      name="content"
                      onChange={handleChange}
                      value={inputs.content}
                      maxLength={500}
                  />

                  {/* Start date of card */}
                  <Form.Control
                      type="date"
                      name="startdate"
                      onChange={handleChange}
                      value={inputs.startdate}
                      onFocus={() => inputs.startdate}
                      placeholder={inputs.startdate}
                  />

                  {/* End date of card */}
                  <Form.Control
                      type="date"
                      name="enddate"
                      onChange={handleChange}
                      value={inputs.enddate}
                      onFocus={() => inputs.enddate}
                      placeholder={inputs.enddate}
                  />
              </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' id={s.delete_item} onClick={handleDelete}>Delete</Button>
          <Button onClick={handleSubmit}>Save</Button>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
  );
}

function CreateCard(props) {

  const [inputs, setInputs] = useState({});
  const [alert, setAlert] = useState(false);

  const AlertDismissible = () => {
      if (alert) {
          return (
            <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                Make sure to fill out all form fields correctly!
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
      if (Object.keys(inputs).length < 4  || emptyFields() || inputs.start > inputs.end){
          setAlert(true);
      } else {
          // Send to database
          const newItemPosition = props.items
                                       .filter(item => [props.currentColumn.itemgroupid].flat().includes(item.itemgroups_groupid))
                                       .length;

          console.log(newItemPosition);
          await axios.post('/add_item', 
          {
            title: inputs.title,
            content: inputs.content, 
            startdate: inputs.start, 
            enddate: inputs.end, 
            position: newItemPosition, 
            user: localStorage.getItem('user'),
            groupid: props.currentColumn.itemgroupid
          })


          console.log(inputs);
          setInputs({});
          // props.handleAdd();

          await props.getItems();
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
           Create item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <AlertDismissible />
          <Form onSubmit={handleSubmit}>
              <Form.Group id={s.form_pairs}>
                  {/* Title of card */}
                  <Form.Control
                      placeholder="Title:"
                      type="text"
                      name="title"
                      onChange={handleChange}
                      maxLength={200}
                      // value={props.currentCard.title}
                  />

                  {/* Content of card - for reading purposes only */}
                  <Form.Control
                      placeholder="Content:"
                      type="text"
                      as="textarea"
                      rows={5}
                      name="content"
                      onChange={handleChange}
                      maxLength={500}
                      // value={props.currentCard.content}
                  />

                  <FloatingLabel
                    controlId="floatingInput"
                    label="Start date"
                    className="mb-3"
                  >
                    {/* Start date of card */}
                    <Form.Control
                        type="date"
                        name="start"
                        onChange={handleChange}
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingInput"
                    label="End date"
                    className="mb-3"
                  >
                    {/* End date of card */}
                    <Form.Control
                        type="date"
                        name="end"
                        onChange={handleChange}
                    />
                  </FloatingLabel>
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

function ChangeGroup(props) {

  const [inputs, setInputs] = useState({});
  const [alert, setAlert] = useState(false);

  const AlertDismissible = () => {
      if (alert) {
          return (
            <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                Make sure to give your group a name!
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
      if (Object.keys(inputs).length < 1  || emptyFields()){
          setAlert(true);
      } else {
          // Send to database

          console.log();
          const response = await axios.post('/change_group_name', 
          {
            name: inputs.name, 
            groupid: props.currentGroup.itemgroupid, 
            user: localStorage.getItem('user')
          })

          if (response.data.response !== "Success") {
            console.log("Something went wrong...");
          }

          await props.getGroups();

          console.log(inputs);
          // console.log(props.currentCard);
          setInputs({});
          props.onHide();
      }
  }

  // Should be fine 
  const handleClose = () => {
      setInputs({});
      props.onHide();
  }

  // Will have to find the card in the array 
  const handleDelete = async () => {
    // console.log(props.currentCard);

    const response = await axios.post('/delete_group', 
      {
        groupid: props.currentGroup.itemgroupid,
        user: localStorage.getItem('user')
      })

    if (response.data.response !== "Success") {
      console.log("Something went wrong...");
    }

    await props.getGroups();
    await props.getItems();

    setInputs({});
    props.onHide();
  }

  return (
      <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton onClick={props.onHide}>
          <Modal.Title id="contained-modal-title-vcenter">
           Edit group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <AlertDismissible />
          <Form onSubmit={handleSubmit}>
              <Form.Group id={s.form_pairs}>
                  {/* Title of card */}
                  <Form.Control
                      placeholder="Name of group:"
                      type="text"
                      name="name"
                      onChange={handleChange}
                      maxLength={100}
                  />
              </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' id={s.delete_item} onClick={handleDelete}>Delete</Button>
          <Button onClick={handleSubmit}>Save</Button>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
  );
}

/**
 * This works (as of 11/02/2024)
 * @param {*} props 
 * @returns 
 */
function CreateGroup(props) {

  const [inputs, setInputs] = useState({});
  const [alert, setAlert] = useState(false);

  const AlertDismissible = () => {
      if (alert) {
          return (
            <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                Make sure to give your group a name!
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
      if (Object.keys(inputs).length < 1  || emptyFields()){
          setAlert(true);
      } else {
          // Send to database
          console.log(inputs);

          await axios.post('/add_group', {name: inputs.name, user: localStorage.getItem('user')});
          await props.getGroups();

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
           Create group
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <AlertDismissible />
          <Form onSubmit={handleSubmit}>
              <Form.Group id={s.form_pairs}>
                  {/* Title of card */}
                  <Form.Control
                      placeholder="Name of group:"
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

export default function Kanban() {
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [createCard, setCreateCard] = useState(false);
  const [changeCard, setChangeCard] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const [changeGroup, setChangeGroup] = useState(false);
  const [currentCard, setCurrentCard] = useState({name: "Placeholder name", 
                                                  content: "Placeholder content", 
                                                  start: "2024-02-15", 
                                                  end: "2024-02-15"});
  const [currentColumn, setCurrentColumn] = useState(undefined);

  const navigate = useNavigate();

  const getGroups = async () => {
    const response = await axios.post('/get_groups', {user: localStorage.getItem('user')})
  
    if (response.data.response === "Success") {
      setGroups(response.data.groups);
    } else {
      console.log(response);
    }
  }

  const getItemsTest = async () => {
    const response = await axios.post('/get_items', {user: localStorage.getItem('user')})
  
    if (response.data.response === "Success") {
      const sortedItems = (response.data.items).sort((a,b) => a.position - b.position);

      // Formatting the start and end date, as SQL adds a time to the value
      sortedItems.forEach((item, index) => {
        sortedItems[index].startdate = item.startdate.split("T")[0];
        sortedItems[index].enddate = item.enddate.split("T")[0];
      })

      // console.log(sortedItems);

      setItems(sortedItems);

      // console.log(items);
    } else {
        console.log(response);
    }
  }

  const updateItemPositions = async (changedItems, newGroupId) => {

    console.log(items);

    for (let index in changedItems) {
      const response = await axios.post("/change_item_position", 
        {position: index, user: localStorage.getItem('user'), itemid: changedItems[index].itemid, groupid: newGroupId})
      
      console.log(`${changedItems[index].title} now has position ${index}`)
      if (response.data.response !== "Success") {
        console.log("Something went wrong...")
        break;
      }
    }
  }

  // Only want to do this on the initial render - need an empty dependency array
  useEffect(() => {

      // Get groups and items 
      getGroups();
      getItemsTest();
  }, []);


  /**
   * Do not touch!!!
   * @param {Contains the source and destination of the drag} result 
   * @returns 
   */
  async function onDragEnd(result) {

    // Splits the result of the drag into two parts, source and destination 
    // This will be the droppable id, which is set to the index of the group in the 
    // groups list
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      // No changes made 
      return;
    }

    // Creates two new constants which store the source's droppable id and the destination's droppable id
    // These will be the indices of the groups in the groups list 
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    // If the item is in the same container...
    if (sInd === dInd) {

      // Reorder the items in the container and store result in items 
      // Each item should have an order field, and once the order is changed, 
      // sort by this order field 
      const changedItems =  reorder(items.filter(item => ([groups[sInd].itemgroupid]).includes(item.itemgroups_groupid)), source.index, destination.index);

      const itemsClone = items;
      itemsClone.forEach((item, i) => {
        if (item.itemgroups_groupid === groups[sInd].groupid) {
          const replacementItem = changedItems.filter(changedItem => [item.itemid].flat().contains(changedItem.itemid))[0];
          itemsClone[i] = replacementItem;
        }
      })

      const sortedItemsClone = (itemsClone).sort((a,b) => a.position - b.position);
      setItems(sortedItemsClone);

      await updateItemPositions(changedItems, groups[sInd].itemgroupid);
      await getItemsTest();

    } else {

      // Item is not in the same container, so move the item 
      // This will now mean changing the item's group id 
      const result = move(
        items.filter(item => ([groups[sInd].itemgroupid]).includes(item.itemgroups_groupid)),
        items.filter(item => ([groups[dInd].itemgroupid]).includes(item.itemgroups_groupid)),
        source, 
        destination, 
        groups);

      console.log(result);

      const itemsClone = items;

      itemsClone.forEach((item, i) => {
        if (item.itemgroups_groupid === groups[sInd].groupid) {
          const replacementItem = result[sInd].filter(changedItem => [item.itemid].flat().contains(changedItem.itemid))[0];
          itemsClone[i] = replacementItem;
        }
      })

      itemsClone.forEach((item, i) => {
        if (item.itemgroups_groupid === groups[dInd].groupid) {
          const replacementItem = result[dInd].filter(changedItem => [item.itemid].flat().contains(changedItem.itemid))[0];
          itemsClone[i] = replacementItem;
        }
      })

      const sortedItemsClone = (itemsClone).sort((a,b) => a.position - b.position);
      console.log(sortedItemsClone);
      setItems(sortedItemsClone);

      await updateItemPositions(result[sInd], groups[source.droppableId].itemgroupid);
      await updateItemPositions(result[dInd], groups[destination.droppableId].itemgroupid);
      await getItemsTest();
    }
  }

  return (
    <div id={s.kanban_container} className={s.top_scroll}>
      <div id={s.kanban_board} > 
            <DragDropContext onDragEnd={onDragEnd}>

                {/* For each column... */}
            {groups.map((el, ind) => (
                <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (

                    // This is the column
                    <Card 
                    ref={provided.innerRef}
                    // style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                    className={s.kanban_column}
                    >

                        {/* Name of column */}
                        <Card.Header 
                          id={s.kanban_column_name} 
                          onClick={() => {
                            setCurrentColumn(groups[parseInt(provided.droppableProps["data-rfd-droppable-id"])]);
                            setChangeGroup(true);
                        }}>
                          {el.name}
                        </Card.Header>
                        <div id={s.kanban_item_container}>
                                
                        {/* For each item in the column... */}
                    {items.filter(item => ([el.itemgroupid]).flat().includes( item.itemgroups_groupid )).map((item, index) => (
                        <Draggable 
                          key={item.itemid}
                          draggableId={`${item.itemid}`}
                          index={index}
                        >
                        {(provided, snapshot) => (
                            
                            <Card
                              id={s.kanban_item}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              // border='primary'
                              onClick={() => {
                                setCurrentCard(item);
                                // setCurrentColumn(el);
                                setChangeCard(true);
                              }}
                            >
                                {/* The item box */}
                                <Card.Body>
                                    {/* Item content is placed here */}
                                    <Card.Text>{item.title}</Card.Text>
                                </Card.Body>
                            </Card>
                        )}
                        </Draggable>
                    ))}
                    </div>
                    {provided.placeholder}

                    {/* Add a new item to the board */}
                    <Button
                        id={s.kanban_add_item_button}
                        type="button"
                        onClick={() => {
                          setCurrentColumn(groups[parseInt(provided.droppableProps["data-rfd-droppable-id"])]);
                          setCreateCard(true);
                        }}
                    >
                        Add new item
                    </Button>
                    </Card>
                )}
                </Droppable>
            ))}
            </DragDropContext>

            <Button
                type="button"
                id={s.kanban_add_column_button}
                onClick={() => {
                  // Adds an empty array to the state, creating a new list
                  setCreateGroup(true);
                }}
            >
                Add new group
            </Button>
      </div>

      <CreateCard 
        show={createCard}
        onHide={() => setCreateCard(false)}
        currentColumn={currentColumn}
        items={items}
        getItems={() => getItemsTest()}
        />

      <ChangeCard 
        show={changeCard}
        onHide={() => setChangeCard(false)}
        currentCard={currentCard}
        setItems={(arg) => setItems(arg) }
        getItems={getItemsTest}
      />

      <CreateGroup
        show={createGroup}
        onHide={() => setCreateGroup(false)}
        setGroups={(arg) => setGroups(arg)}
        getGroups={getGroups}
      />

      <ChangeGroup
        show={changeGroup}
        onHide={() => setChangeGroup(false)}
        currentGroup={currentColumn}
        getGroups={getGroups}
        getItems={getItemsTest}
      />
    </div>
  );
}


