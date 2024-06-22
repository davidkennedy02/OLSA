import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation } from 'react-router-dom';
import s from './NavBarInStyle.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { toInt, toDate, toBoolean } from 'validator';
import useSound from 'use-sound';
import timerSound from './../../Assets/notifications-sound-127856.mp3'

function AlertDismissible() {
  const [show, setShow] = useState(false);
  const [playSound] = useSound(timerSound, {volume: 1.0, soundEnabled: true});

  const getRemainingSecs = async () => {
    const savedDateTime = await localStorage.getItem('savedDateTime');
    const remainingSecs = await localStorage.getItem('remainingSecs');
    const running       = await localStorage.getItem('running');

    // Might not exist
    if (savedDateTime !== null && remainingSecs !== null && running !== null) {

      const futureTime = toDate(savedDateTime);
      futureTime.setSeconds(futureTime.getSeconds() + toInt(remainingSecs));

      const now = new Date();

      if (( now.getTime() > futureTime.getTime() ) && toBoolean(running)) {
        setShow(true);
        playSound();
      }
    }
  }

  useEffect(()=>{

    getRemainingSecs();
 
    const interval=setInterval(()=>{ getRemainingSecs()},5000)
 
 
    return () => clearInterval(interval)
 
 },[])

  if (show) {

    playSound();
    return (
      <Snackbar 
        open={show} 
        onClose={() => {
          setShow(false);
          localStorage.setItem('running', false);
          localStorage.setItem('remainingSecs', 0);
        }}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
        <Alert 
          severity="success"
          onClose={() => {
            setShow(false);
            localStorage.setItem('running', false);
            localStorage.setItem('remainingSecs', 0);
          }}
          >
        Your timer is complete!
      </Alert>
    </Snackbar>
    );
  }
}

function NavbarIn() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/olsa/landing-page');
  }

  let location = useLocation();

  return (
    <Navbar expand="lg" bg="white" id={s.navbar_colour} className="bg-body-tertiary">
      <AlertDismissible/>
      <Container>
        <Navbar.Brand as={Link} to="/olsa/">OLSA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/olsa/flashcards">Flashcards</Nav.Link>
            <Nav.Link as={Link} to="/olsa/notes">Notes</Nav.Link>
            <Nav.Link as={Link} to="/olsa/schedule">Schedule</Nav.Link>
            <Nav.Link as={Link} to="/olsa/repository">Repository</Nav.Link>
            {window.location.pathname === '/olsa/timer' ? 
            <Nav.Link onClick={async () => window.location.href="/olsa/timer"} >Timer</Nav.Link> : 
            <Nav.Link as={Link}  to='/olsa/timer'>Timer</Nav.Link> }
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarIn;