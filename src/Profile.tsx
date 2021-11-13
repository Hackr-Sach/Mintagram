import React, { useState } from "react";
import { Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Input } from "@chakra-ui/react";
import { useMoralisFile } from "react-moralis";
import { MintagramNavbar } from "./components/Navbar";

export const UserProfile = () => {

    return(
      <div>
        <MintagramNavbar />
        <Stack spacing={6}>
          <Heading>Profile</Heading>
        </Stack>
    </div>
    
    );
}