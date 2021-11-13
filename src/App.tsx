import {Button, Container} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useMoralis } from 'react-moralis';
import { Auth } from './Auth';
import { MintagramNavbar } from './components/Navbar';
import { Home } from './HomeFeed';

function App() {
  const { isAuthenticated, logout } = useMoralis();

  if (isAuthenticated) {
    return (
      <div>
        <MintagramNavbar />
        <Container>
        <h1>Mintagram</h1>
        <Button onClick={() => logout()}>Logout</Button>
        <Home />
      </Container>
      </div>
    );
  }

  return (
    <div>
      <Container>
      <h1>Welcome - Log in or sign up</h1>
      <Auth />
    </Container>
    </div>
  );
}

export default App;
