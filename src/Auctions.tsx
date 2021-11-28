import React, { useState, useEffect } from "react";
import { Container, Button} from "react-bootstrap";
import { useMoralis } from "react-moralis";
import { useGetAuction, useGetAuctions } from "./hooks";

 
export const Auctions = () => {
  const { Moralis, enableWeb3, isAuthenticated, authError} = useMoralis();
  useEffect( () => {if(isAuthenticated){ enableWeb3()}}, [isAuthenticated])
  const{handleGetAuctions, auctionsGetterState} = useGetAuctions("0x9E0F7dF9Cee5C5EdFF28dCBAB838CA50E5476d51") // to be worked on cant test

    return(
      <div>
          <Container>
            <h1>Auctions</h1>

            <a href="/CreateAuction">
              <Button>Start Auction</Button>
            </a>
            <Button variant="primary" type="button" onClick={handleGetAuctions}>getAuctions</Button>
          </Container>
    </div>
      
    );
}