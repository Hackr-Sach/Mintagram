import {Button, Container} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useMoralis } from 'react-moralis';
import { Auth } from './Auth';
<<<<<<< Updated upstream
import { UploadMint } from './UploadMint';
=======
import { MintagramNavbar } from './components/Navbar';
import { Home } from './HomeFeed';
import { Footer } from './Footer';
>>>>>>> Stashed changes

function App() {
  const { isAuthenticated, logout } = useMoralis();

  if (isAuthenticated) {
    return (
<<<<<<< Updated upstream
      <Container>
        <h1>Mintagram</h1>
        <Button onClick={() => logout()}>Logout</Button>
        <UploadMint />
      </Container>
=======
      <div id="app-inner">
        <MintagramNavbar />
        <Container>
          <Home />
          
        </Container>
        <Footer />
      </div>
>>>>>>> Stashed changes
    );
  }

  return (
<<<<<<< Updated upstream
    <Container>
      <h1>Welcome - Log in or sign up</h1>
      <Auth />
    </Container>
=======
    <div id="app-inner">
      <Container>
        <h1>
          Welcome - Log in or sign up
          </h1>
        <Auth />
      </Container>
    </div>
>>>>>>> Stashed changes
  );
}

export default App;
