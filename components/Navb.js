import {Nav,Navbar,Container,Button} from 'react-bootstrap'
import cookie from 'js-cookie'
import Router from 'next/router';
export default function Navb(props) {
  
  return (
    <>
    <Navbar bg="dark" variant="dark">
        <Container>
            <Navbar.Brand>{props.title}</Navbar.Brand>
            <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            
            </Nav>
            <Nav className="justify-content-end">
            <Button
            onClick={() => {
              cookie.remove('token');
              Router.push('/')
             
              }} >
            Logout
          </Button>
            </Nav>
        </Container>
  </Navbar>
  <br />
    </>
  )
}
