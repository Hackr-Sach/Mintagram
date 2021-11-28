import React, { useState, useEffect } from "react";
import {Button, Stack, Container, Form} from 'react-bootstrap'
import { useMoralis } from "react-moralis";
import { MintagramNavbar } from "./components/Navbar";
import { useCreateAuction, useGetAuction, useGetAuctions } from "./hooks";

export const CreateAuction = () => {
    const { Moralis, enableWeb3, isAuthenticated, authError, user} = useMoralis();
    useEffect( () => {if(isAuthenticated){ enableWeb3()}}, [isAuthenticated]) 
    const contractAddress = (process.env.REACT_APP_DEPLOYED_AUCTION as string)
    const[NFT, setNFT] = useState<any>({value: ""})
    const[tokenId, setTokenId] = useState<any|File>({value: ""})
    const[seller, setSeller] = useState<any>({value: ""})
    const[startPrice, setStartPrice] = useState<any>({value: ''})
    const[duration, setDuration] = useState<any>({value: ""})
    const[startedAt, setSetStartedAt] = useState<any|File>({value: "0"})
    const[highestBid, setHighestBid] = useState<any>({value: "0"})
    const[highestBidder, setHighestBidder] = useState<any>({value: ""}) // init seller
  
     // input handlers
  const NFTOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setNFT({value: event.target.value})
  }
  const tokenIdOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setTokenId({value: event.target.value})
  }
  const sellerOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setSeller({value: event.target.value})
    setHighestBidder({value: seller.value})
  }
  const startPriceOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setStartPrice({value: event.target.value})
    setHighestBidder({value: seller.value})
  }
  const durationOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setDuration({value: event.target.value})
  }

  // the hook calling creatAuction function in StandardAuction Contract
  const {handleCreateAuction, auctionCreationState} = useCreateAuction(
    (contractAddress as string),
    (NFT.value as string),
    (tokenId.value as any),
    (seller.value as string),
    (startPrice.value as any),
    (duration.value as any),
    (startedAt.value as any),
    (highestBid.value as any),
    (highestBidder.value as string)
    )

        return(
        <div>
        <MintagramNavbar />
        <Stack>
          <Container>
            <h4>Create an Auction</h4>
                <Form>
                    <Form.Group className="mb-3" controlId="NFTaddress">
                        <Form.Label>NFT address</Form.Label>
                        <Form.Control type="textarea" placeholder="name your photo" onChange={NFTOnChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="tokenID">
                        <Form.Label>Token ID</Form.Label>
                        <Form.Control as="textarea" placeholder="" onChange={tokenIdOnChange}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="sellerAddress">
                        <Form.Label>Seller address</Form.Label>
                        <Form.Control as="textarea" placeholder="" onChange={sellerOnChange}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="startPrice">
                        <Form.Label>Start price</Form.Label>
                        <Form.Control as="textarea" placeholder="" onChange={startPriceOnChange}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="auctionDuration">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control as="textarea" placeholder="" onChange={durationOnChange}/>
                    </Form.Group>

                    <Button variant="primary" type="button" onClick={handleCreateAuction}>Create</Button>
                </Form>
          </Container>
        </Stack>
        </div>
        );
}