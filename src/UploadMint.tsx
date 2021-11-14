import React, { useState, useEffect } from "react";
import {Button, Stack, Container, Form} from 'react-bootstrap'
import { MintagramNavbar } from "./components/Navbar";
import { useMoralis, useMoralisFile } from "react-moralis";
import axios from "axios";
import { useCallMint, useSetTokenUri } from "./hooks";
import { Uint256 } from "soltypes";

export const UploadMint = () => {
  const userAddress:any ="0x72D1CbA159e87c017C9e9f672efBab3C2DfBfadA";
  const contractAddress = (process.env.DEPLOYED_CONTRACT as string)
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { Moralis, enableWeb3, authenticate, isAuthenticated, isAuthenticating, authError} = useMoralis();
  // state 
  const[userDescription, setUserDescription] = useState<any>({value: ""})
  const[usersImgUrl, setusersImgUrl] = useState<any|File>({value: ""})
  const[userNftName, setUserNftName] = useState<any>({value: ""})
  const[tokenURI, setTokenURI] = useState<any>({value: ''})
  const[tokenId, setTokenId] = useState<any>({value: ""})
  let ipfsArray:any = [];
 

  useEffect( () => {if(isAuthenticated){ enableWeb3()}}, [isAuthenticated])

  //handling image & metadata IPFS start
  const saveImageToIPFS = async (event: React.ChangeEvent<HTMLInputElement>) =>{
    if (event.currentTarget.files && event.currentTarget.files[0] != null) {
        await saveFile(event.currentTarget.files[0].name, event.currentTarget.files[0], { saveIPFS: true })
        .then((res:any) => {   
          setusersImgUrl((res as any))
        })
        .catch( (error) => {
            console.log(error)
          }) 
      }
    }
  const nameOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setUserNftName({value: event.target.value})
  }
  const descOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setUserDescription({value: event.target.value})
  }

  const handleMeta = () => {  
  ipfsArray.push({
    path: `metadata/${userNftName.value}.json`,
      content: {
        image: `${usersImgUrl._url}`,
        name: `${userNftName.value}`,
        description: `${userDescription.value}`
      }
    })
    axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
    ipfsArray,
      {
        headers: {
        "X-API-KEY": 'Moralis_API_KEY',
        "Content-Type": "application/json",
        "accept": "application/json"
        } 
      })
      .then((res) => {
        console.log(res.data)
        setTokenURI(res)
      })
      .catch ( error => {
        console.log(error)
      }) 
      
  }
  // const getTokenId = async () => {
  //   // const options = {chain: 'rinkeby', address:`${userAddress}`, limit: "1"}
  //   // const transfersNFT:any = await Moralis.Web3API.account.getNFTTransfers((options as any))
  //   // .then( res => setTokenId(res))
  //   // .catch( e => {
  //   //   console.log(e)
  //   // })
  //   // console.log(tokenId)
  // }
  // calls a hook to handle the contract interaction with mint  useSetTokenUri
  const {handleMint, mintState} = useCallMint(contractAddress)
  // calls a hook to set token URI for user mint
  
  const {handleSetTokenUri, tokenUriState} = useSetTokenUri(
    contractAddress, 
    (8 as unknown as Uint256), 
    tokenURI.data ? (tokenURI.data[0].path as any) : '',
    )

  return (
    <div>
      <MintagramNavbar />
      <Stack>
        <Container>
          <h4>Upload your image</h4>
          <input accept=".png, .jpg, .jpeg" type="file" onChange={saveImageToIPFS} />
          <h4>Set your meta data</h4>
          <Form>
            <Form.Group className="mb-3" controlId="userNftName">
              <Form.Label>Name</Form.Label>
                <Form.Control type="textarea" placeholder="name your photo" onChange={nameOnChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="userDesc">
              <Form.Label>Describe your photo</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="enter a description" 
                  onChange={descOnChange}/>
              </Form.Group>
              <Button variant="primary" type="button" onClick={handleMeta} >
                Submit
              </Button>
            </Form>
     
          <h4>Create token</h4>
          <Button onClick={handleMint}>Mint</Button>
          {/* <Button onClick={getTokenId}>getTokenId</Button> */}
          <h4>Set token uri</h4> 
          <Button onClick={handleSetTokenUri}>Set URI</Button>
        </Container>
      </Stack>
    </div>
    
    
  )
}


