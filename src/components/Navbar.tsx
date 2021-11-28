
<<<<<<< Updated upstream
import { Nav, Navbar, Container  } from 'react-bootstrap';
=======
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { useMoralis } from 'react-moralis';
>>>>>>> Stashed changes

export const MintagramNavbar = () => {

    return(
<<<<<<< Updated upstream
        <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/Home">Home</Nav.Link>
            <Nav.Link href="/Favorites">Favorites</Nav.Link>
            <Nav.Link href="/Mint-Images">Mint-images</Nav.Link>
            <Nav.Link href="/Auctions">Auctions</Nav.Link>
            <Nav.Link href="/Profile">Profile</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    
=======
      <div id="nav-bar">
        <Navbar>
          <Container>
            <div
              id="logo"
              className="mintagram-logo">
              <Nav.Link className="NavButton" href="/Home">
                <svg 
                  className="NavBarLogo nav-bar-logo"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M60.146 54.634C46.085 45.952 43.177 30.547 41.445 15.408C41.066 12.096 39.101 5.048 34.084 8.39C32.046 9.745 31 11.948 29.818 14.012C28.464 16.379 26.949 18.57 25.193 20.548C24.88 15.473 24.362 10.336 22.879 5.691C21.735 2.109 17.545 0.538001 14.887 3.719C12.801 6.215 10.98 14.002 6.854 12.8C1.981 11.381 -0.0839999 18.931 4.766 20.344C9.061 21.595 12.845 20.24 15.803 16.986C16.213 16.534 16.588 16.051 16.945 15.554C17.467 19.96 17.524 24.528 17.796 28.742C17.974 31.484 21.071 33.9 23.705 32.12C28.18 29.092 31.395 25.441 34.263 21.332C34.363 22.2 34.458 23.068 34.579 23.934C36.659 39.036 42.745 53.093 56.184 61.39C60.499 64.056 64.44 57.286 60.146 54.634" 
                      />
                </svg>
              </Nav.Link>
            </div>
            <Nav className="">
              <Nav.Link className="NavButton" href="/Home">Home</Nav.Link>
              <Nav.Link className="NavButton" href="/Mint-Images">Mint-images</Nav.Link>
              <Nav.Link className="NavButton" href="/Auctions">Auctions</Nav.Link>
              <Nav.Link className="NavButton" href="/Profile">Profile</Nav.Link>
            </Nav>
            <Button 
              className=""
              onClick={() => logout()}>
              Logout
            </Button>
          </Container>
        </Navbar>
      </div>
>>>>>>> Stashed changes
    );
}