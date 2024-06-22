import s from './DataVisualisationStyle.module.css';
import NavbarIn from '../../Components/NavBarIn/NavBarIn';
import Kanban from '../../Components/Kanban/Kanban';
import Gantt from '../../Components/Gantt/Gantt';
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import ListGroup from 'react-bootstrap/ListGroup';
import CalendarComponent from '../../Components/CalendarComponent/CalendarComponent';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

function DataVisualisation() {

    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const navigate = useNavigate();

    // Runs when function is called initially 
    useEffect(() => {
      const auth = localStorage.getItem('user');
      if (!auth) {
          navigate('/olsa/landing-page');
      }
  }, [])

    return (
        <main>  
            <div className={s.background_1}>
                <NavbarIn></NavbarIn>
            
                <div id={s.title_container}>
                    <h1 id={s.title}>Schedule</h1>
                </div>

                <div id={s.main_content_container}>
                    <Box >
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                            <Tab label="Kanban" {...a11yProps(0)} />
                            <Tab label="Gantt Chart" {...a11yProps(1)} />
                            <Tab label="Calendar" {...a11yProps(2)} />
                        </Tabs>
                        </Box>
                
                        <CustomTabPanel id={s.kanban_container} value={value} index={0}>
                            <Kanban></Kanban>
                        </CustomTabPanel>
                
                        <CustomTabPanel value={value} index={1}>
                            <Gantt></Gantt>
                        </CustomTabPanel>
                
                        <CustomTabPanel value={value} index={2}>
                            <CalendarComponent></CalendarComponent>
                        </CustomTabPanel>
                    </Box>
                </div>
                
        
                <div className={s.footer}>
                  <p>Copyright @ 2024 OLSA Inc</p>
                  <p>dk94@st-andrews.ac.uk</p>
                  <p>Made with React</p>
                </div>
            </div>
        </main>
    )
}

export default DataVisualisation