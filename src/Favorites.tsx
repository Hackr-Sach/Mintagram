import React, { useState } from "react";
import { Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Input } from "@chakra-ui/react";
import { useMoralisFile } from "react-moralis";

export const Favorites = () => {

    return(
      <div>
        <Stack spacing={6}>
          <Heading>Favorites</Heading>
        </Stack>
    </div>
    
    );
}