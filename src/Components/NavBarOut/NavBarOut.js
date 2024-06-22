import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import s from './NavBarOutStyle.module.css' 

function NavbarOut() {
  return (
    <Navbar id={s.navbar_colour} expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/olsa/landing-page">OLSA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/olsa/create-account">Create account</Nav.Link>
            <Nav.Link as={Link} to="/olsa/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
  );
}

export default NavbarOut;