import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListGroup from 'react-bootstrap/ListGroup';
import s from './DailyStyle.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'https://dk94.teaching.cs.st-andrews.ac.uk/server';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DailyOverview() {

  const [value, setValue] = React.useState(0);
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getGroups = async () => {
    const response = await axios.post('/get_groups', {user: localStorage.getItem('user')})
  
    if (response.data.response === "Success") {
      setGroups(response.data.groups);
    } else {
      console.log(response);
    }
  }

  const getItems = async () => {
    const response = await axios.post('/get_items', {user: localStorage.getItem('user')})
  
    if (response.data.response === "Success") {
      const sortedItems = (response.data.items).sort((a,b) => a.position - b.position);
      setItems(sortedItems);

      console.log(items);
    } else {
        console.log(response);
    }
  }

  useEffect(() => {
    getGroups();
    getItems();
  }, [])

  return (
    <Box id={s.box}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          {groups.map((group, index) => { 
              return (
                <Tab label={group.name} {...a11yProps(index)} />
              ) 
          })}
        </Tabs>
      </Box>

      
      {groups.map((group, index) => {
        return (
          <CustomTabPanel value={value} index={index}>

            {items.filter(item => ([group.itemgroupid]).flat().includes( item.itemgroups_groupid )).length > 0 ? 
            (
              <ListGroup className={s.list_group}>
              {items.filter(item => ([group.itemgroupid]).flat().includes( item.itemgroups_groupid )).map((item, index) => {
                return (
                  <ListGroup.Item>{item.title}</ListGroup.Item>
                )
              })}
              </ListGroup> ) : 
              (
                <h5>Nothing to see here...</h5>
              )
            }
          </CustomTabPanel>
        )
      })}
    </Box>
  );
}