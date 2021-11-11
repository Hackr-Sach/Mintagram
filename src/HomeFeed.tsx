/*
    So we need to first pull in all users nfts and display them with their metadata. 

    Second a user viewing these should be able to subscribe to another user aka add that user
    to some set.

    Next when a user clicks (subscriptions) their feed will now only contain those users nft

    this is the only filtering functionality we will have until the 2nd iteration
*/
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useMoralisFile } from "react-moralis";
import { MintagramNavbar } from "./components/Navbar";

export const Home = () => {

    return(
        <div>
            <Container>
                <h1>Home Feed</h1>
            </Container>
            <MintagramNavbar />
        </div>  
    );
}