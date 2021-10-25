import {
  Badge,
  Box,
  Container,
  Heading,
  Wrap,
  Center,
  Spinner,
  WrapItem,
} from "@chakra-ui/react";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import React from "react";
import { useMoralis } from "react-moralis";

function App() {
  const location = useLocation();
  const { isInitializing, isInitialized } = useMoralis();

  if (isInitializing) {
    return (
      <Container my={8} pt={8} maxW="container.lg">
        <Center>
          <Spinner
            thickness="4px"
            emptyColor="whiteAlpha.400"
            color="blue.400"
            speed="0.65s"
            size="xl"
          />
        </Center>
      </Container>
    );
  }

  if (!isInitialized) {
    <Container my={8} maxW="container.lg">
      <Heading as="h1" size="4xl">
        Failed to initialize
      </Heading>
    </Container>;
  }
  return (
    <Container my={8} maxW="container.lg">
      <Heading as="h1" size="4xl">
        react-moralis
      </Heading>
    </Container>
  );
}

export default App;
