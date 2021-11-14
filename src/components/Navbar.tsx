
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { useMoralis } from 'react-moralis';
import "./Navbar.css"
export const MintagramNavbar = () => {
  const {logout} = useMoralis();
    return(
      <div>
        <Navbar bg="dark" variant="dark">
        <Container>
          <img className="NavBarLogo" src="https://images.squarespace-cdn.com/content/v1/575a6067b654f9b902f452f4/1552683653140-0UUVQSSUEWVC73AWAEQG/300Logo.png" alt="" />
          <Nav className="me-auto">
            <Nav.Link className="NavButton" href="/Home">Home</Nav.Link>
            <Nav.Link className="NavButton" href="/Mint-Images">Mint-images</Nav.Link>
            <Nav.Link className="NavButton" href="/Auctions">Auctions</Nav.Link>
            <Nav.Link className="NavButton" href="/Profile">Profile</Nav.Link>
          </Nav>
          <Button onClick={() => logout()}>Logout</Button>
        </Container>
      </Navbar>
      </div>
    
    );
}