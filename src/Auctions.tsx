import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useMoralis } from "react-moralis";
import { MintagramNavbar } from "./components/Navbar";

export const Auctions = () => {

    return(
      <div>
          <MintagramNavbar />
          <Container>
            <h1>Auctions</h1>
          </Container>
    </div>
    
    );
}