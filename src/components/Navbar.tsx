
import { Nav, Navbar, Container  } from 'react-bootstrap';

export const MintagramNavbar = () => {

    return(
        <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/Home">Home</Nav.Link>
            <Nav.Link href="/Mint-Images">Mint-images</Nav.Link>
            <Nav.Link href="/Auctions">Auctions</Nav.Link>
            <Nav.Link href="/Profile">Profile</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    
    );
}