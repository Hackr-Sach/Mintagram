import { Button } from '@chakra-ui/react';
import { Container, Heading } from '@chakra-ui/layout';
import { useMoralis } from 'react-moralis';
import { Auth } from './Auth';
import { UploadMint } from './UploadMint';

function App() {
  const { isAuthenticated, logout } = useMoralis();

  if (isAuthenticated) {
    return (
      <Container>
        <Heading>Mint-a-Gram</Heading>
        <Button onClick={() => logout()}>Logout</Button>
        <UploadMint />
      </Container>
    );
  }

  return (
    <Container>
      <Heading mb={6}>Welcome - Log in or sign up</Heading>
      <Auth />
    </Container>
  );
}

export default App;
