/*
    So we need to first pull in all users nfts and display them with their metadata. 

    Second a user viewing these should be able to subscribe to another user aka add that user
    to some set.

    Next when a user clicks (subscriptions) their feed will now only contain those users nft

    this is the only filtering functionality we will have until the 2nd iteration
*/
import React, { useState } from "react";
import { Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Input } from "@chakra-ui/react";
import { useMoralisFile } from "react-moralis";

export const Feed = () => {

    return(
        <div>
            <Stack spacing={6}>
                <Heading>Feed</Heading>
            </Stack>
        </div>
    
    );
}