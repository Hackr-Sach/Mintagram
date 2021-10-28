import React, { useState } from 'react';
import { useMoralis, } from 'react-moralis';

import {
  Button,
  Stack,
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Input,
  Text,
} from '@chakra-ui/react';

export const Auth = () => {
  const { Moralis, authenticate, isAuthenticating, authError, signup, login } = useMoralis();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  try {
    (async function() {
      (Moralis as any).initPlugins();
    })();
  } catch (error) {
    console.log(error);
  }
  
  function buyCrypto(){
    (Moralis as any).Plugins.fiat.buy();
  }

  return (
    <Stack spacing={6}>
      // --------wallet auth--------------
      {authError && (
        <Alert status="error">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Authentication has failed</AlertTitle>
            <AlertDescription display="block">{authError.message}</AlertDescription>
          </Box>
          <CloseButton position="absolute" right="8px" top="8px" />
        </Alert>
      )}
      <Button isLoading={isAuthenticating} onClick={() => authenticate()}>
        Authenticate via Metamask
      </Button>
      <Text textAlign="center">
        <em>or</em>
      </Text>
      // --------sign up--------------
      <Stack spacing={3}>
      <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
      />
      <Button onClick={() => signup(email, password, email)}>Sign up</Button>
    </Stack>
      <Text textAlign="center">
        <em>or</em>
      </Text>
      //---------Login-----------
      <Stack spacing={3}>
      <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
      />
      <Button onClick={() => login(email, password)}>Login</Button>
    </Stack>
    <Button onClick={() => buyCrypto()}>Buy crypto</Button>
    </Stack>
  );
};
