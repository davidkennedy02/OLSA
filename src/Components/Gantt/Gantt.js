import React from "react";
import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";
import axios from 'axios';
import s from './GanttStyle.module.css';
import {Card, Alert, Form, Modal, FloatingLabel, Button} from 'react-bootstrap';
axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';

const columns = [
  { type: "string", label: "Task ID" },
  { type: "string", label: "Task Name" },
  { type: "string", label: "Resource" },
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
];

const rows = [
  [
    "2014Spring",
    "Spring 2014",
    "spring",
    new Date(2014, 2, 22),
    new Date(2014, 5, 20),
    null,
    100,
    null,
  ],
  [
    "2014Summer",
    "Summer 2014",
    "summer",
    new Date(2014, 5, 21),
    new Date(2014, 8, 20),
    null,
    100,
    null,
  ],
  [
    "2014Autumn",
    "Autumn 2014",
    "autumn",
    new Date(2014, 8, 21),
    new Date(2014, 11, 20),
    null,
    100,
    null,
  ],
  [
    "2014Winter",
    "Winter 2014",
    "winter",
    new Date(2014, 11, 21),
    new Date(2015, 2, 21),
    null,
    100,
    null,
  ],
  [
    "2015Spring",
    "Spring 2015",
    "spring",
    new Date(2015, 2, 22),
    new Date(2015, 5, 20),
    null,
    50,
    null,
  ],
  [
    "2015Summer",
    "Summer 2015",
    "summer",
    new Date(2015, 5, 21),
    new Date(2015, 8, 20),
    null,
    0,
    null,
  ],
  [
    "2015Autumn",
    "Autumn 2015",
    "autumn",
    new Date(2015, 8, 21),
    new Date(2015, 11, 20),
    null,
    0,
    null,
  ],
  [
    "2015Winter",
    "Winter 2015",
    "winter",
    new Date(2015, 11, 21),
    new Date(2016, 2, 21),
    null,
    0,
    null,
  ],
  [
    "Football",
    "Football Season",
    "sports",
    new Date(2014, 8, 4),
    new Date(2015, 1, 1),
    null,
    100,
    null,
  ],
  [
    "Baseball",
    "Baseball Season",
    "sports",
    new Date(2015, 2, 31),
    new Date(2015, 9, 20),
    null,
    14,
    null,
  ],
  [
    "Basketball",
    "Basketball Season",
    "sports",
    new Date(2014, 9, 28),
    new Date(2015, 5, 20),
    null,
    86,
    null,
  ],
  [
    "Hockey",
    "Hockey Season",
    "sports",
    new Date(2014, 9, 8),
    new Date(2015, 5, 21),
    null,
    89,
    null,
  ],
];

function CreateItem(props) {

  const [inputs, setInputs] = useState({group: 0});
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
      setInputs(values => ({...values, [name]: value}));
      console.log(inputs);
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
                                       .filter(item => [props.groups[inputs.group].itemgroupid].flat().includes(item.itemgroups_groupid))
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
            groupid: props.groups[inputs.group].itemgroupid
          })


          console.log(inputs);
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
                            value={index}
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

export default function Gantt() {
  const [data, setData] = useState([columns, ...rows]);
  const [itemCount, setItemCount] = useState(rows.length);
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const options = {
    height: 100 + (30 * (itemCount - 1)),
    gantt: {
      trackHeight: 30,
      palette: [
        {
          "color": "#011f4b",
          "dark": "#011f4b",
          "light": "#011f4b"
        },
        {
          "color": "#03396c",
          "dark": "#03396c",
          "light": "#03396c"
        },
        {
          "color": "#005b96",
          "dark": "#005b96",
          "light": "#005b96"
        },
        {
          "color": "#6497b1",
          "dark": "#6497b1",
          "light": "#6497b1"
        },
        {
          "color": "#b3cde0",
          "dark": "#b3cde0",
          "light": "#b3cde0"
        },
        {
          "color": "#6deded",
          "dark": "#6deded",
          "light": "#6deded"
        },
        // {
        //   "color": "#ff7043",
        //   "dark": "#e64a19",
        //   "light": "#ffccbc"
        // },
        // {
        //   "color": "#9e9d24",
        //   "dark": "#827717",
        //   "light": "#f0f4c3"
        // },
        // {
        //   "color": "#5c6bc0",
        //   "dark": "#3949ab",
        //   "light": "#c5cae9"
        // },
        // {
        //   "color": "#f06292",
        //   "dark": "#e91e63",
        //   "light": "#f8bbd0"
        // },
        // {
        //   "color": "#00796b",
        //   "dark": "#004d40",
        //   "light": "#b2dfdb"
        // },
        // {
        //   "color": "#c2185b",
        //   "dark": "#880e4f",
        //   "light": "#f48fb1"
        // }
      ]
    },
  };

  const produceData = async () => {

    const getGroupName = (groupid) => {
      return groups.filter(group => [groupid].flat().includes( group.itemgroupid ))[0].name;
    }

    const groupResponse = await axios.post('/get_groups', {user: localStorage.getItem('user')})
    const groups = groupResponse.data.groups;
    setGroups(groups);

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
      const tempArray = [];
      tempArray.push(item.itemid);
      tempArray.push(item.title);
      tempArray.push(getGroupName(item.itemgroups_groupid));
      tempArray.push(new Date(item.startdate));
      tempArray.push(new Date(item.enddate));
      tempArray.push('');
      tempArray.push("");
      tempArray.push('');

      itemArray.push(tempArray);
    })

    setItemCount(itemArray.length);
    setData([columns, ...itemArray]);
  }

  useEffect(() => {
    produceData();
  }, [])

  return (
    <div>
      <div id={s.button_container}>
        <Button id={s.create_button} onClick={() => setShowCreate(true)}>Create item</Button>
      </div>
      <Card id={s.gantt_card}>
        <Card.Body>
          {data ? <Chart chartType="Gantt" width="100%" height="50%" data={data} options={options}/> : <p>Loading...</p>}
        </Card.Body>
      </Card>
     
      <CreateItem 
        show={showCreate}
        onHide={() => setShowCreate(false)}
        groups={groups}
        items={items}
        produceData={produceData}
      />
    </div>
  );
}
