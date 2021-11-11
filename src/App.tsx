import {Button, Container} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useMoralis } from 'react-moralis';
import { Auth } from './Auth';
import { UploadMint } from './UploadMint';

function App() {
  const { isAuthenticated, logout } = useMoralis();

  if (isAuthenticated) {
    return (
      <Container>
        <h1>Mintagram</h1>
        <Button onClick={() => logout()}>Logout</Button>
        <UploadMint />
      </Container>
    );
  }

  return (
    <Container>
      <h1>Welcome - Log in or sign up</h1>
      <Auth />
    </Container>
  );
}

export default App;
