import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import s from './CalendarStyle.module.css';
import { useState, useEffect } from "react";
import {Form, FloatingLabel, Modal, Button, Alert} from 'react-bootstrap';
import axios from 'axios';
axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';

const localizer = momentLocalizer(moment);

function CreateItem(props) {

  const [inputs, setInputs] = useState({group: 0});
  const [alert, setAlert] = useState(false);

  const AlertDismissible = () => {
      if (alert) {
          return (
            <Alert variant="danger" onClose={() => setAlert(false)} dismissible>
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                Make sure to fill out all the form fields! 
              </p>
            </Alert>
          );
        }
  }

  const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}));
  }

  const emptyFields = () => {
      // Check each field has a value
      for (let [_, value] of Object.entries(inputs)) {
        if (toString(value).trim(" ").length === 0){
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
      if (Object.keys(inputs).length < 5  || emptyFields() || inputs.start > inputs.end){
          setAlert(true);
      } else {
          // Send to database
          const newItemPosition = props.items
                                       .filter(item => [
                                                        props.groups[inputs.group]
                                                             .itemgroupid
                                                       ].flat()
                                                        .includes(item.itemgroups_groupid))
                                       .length;

          await axios.post('/add_item', 
          {
            title: inputs.title,
            content: inputs.content, 
            startdate: inputs.start, 
            enddate: inputs.end, 
            position: newItemPosition, 
            user: localStorage.getItem('user'),
            groupid: props.groups[inputs.group].itemgroupid
          })


          setInputs({});
          // props.handleAdd();

          await props.produceData();
          props.onHide();
      }
  }

  // Should be fine 
  const handleClose = () => {
      setInputs({group: 0});
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

                <FloatingLabel
                  controlId="floatingInput"
                  label="Group"
                  className="mb-3"
                >
                <Form.Select
                    name='group'
                    onChange={handleChange}
                >
                    {props.groups.map((group, index) => (
                        <option
                            name='group'
                            value={`${index}`}
                            onChange={handleChange}
                        >
                            {group.name}
                        </option> 
                    ))}
                </Form.Select>
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

export default function CalendarComponent() {

    const [data, setData] = useState([]);
    const [createModal, setCreateModal] = useState(false);
    const [items, setItems] = useState([]);
    const [groups, setGroups] = useState([]);

    const produceData = async () => {

      const groupResponse = await axios.post('/get_groups', 
      {
        user: localStorage.getItem('user')
      })

      setGroups(groupResponse.data.groups);

      const itemResponse = await axios.post('/get_items', {user: localStorage.getItem('user')})

      // Sort by end date
      const sortedItems = (itemResponse.data.items).sort((a,b) => a.enddate - b.enddate);
      setItems(sortedItems);
  
      // Formatting the start and end date, as SQL adds a time to the value
      sortedItems.forEach((item, index) => {
        sortedItems[index].startdate = item.startdate.split("T")[0];
        sortedItems[index].enddate = item.enddate.split("T")[0];
      })
  
      const itemArray = [];
      sortedItems.forEach((item) => {
        const tempDict = {
            start: moment(item.startdate).toDate(),
            end: moment(item.enddate).toDate(),
            title: item.title
        };
        
        itemArray.push(tempDict);
      })
  
      setData(itemArray);
  
    }
  
    useEffect(() => {
      produceData();
    }, [])
    
    return (
    <div className="App">

      <div id={s.button_container}>
        <Button id={s.create_item_button} onClick={() => setCreateModal(true)}>Add item</Button>
      </div>

      <Calendar
      id={s.calendar_component}
      localizer={localizer}
      defaultDate={new Date()}
      defaultView="month"
      events={data}
      style={{ height: "80vh", fontSize: '10px' }}
      />

      <CreateItem  
        show={createModal}
        onHide={() => setCreateModal(false)}
        produceData={produceData}
        items={items}
        groups={groups}
      />

    </div>
    );
}
