import React, { useState, useEffect } from "react";
import {Button, Stack, Container, Form} from 'react-bootstrap'
import { MintagramNavbar } from "./components/Navbar";
import { useMoralis, useMoralisFile, useMoralisWeb3Api } from "react-moralis";
import axios from "axios";
import { useCallMint, useSetTokenUri } from "./hooks";

export const UploadMint = () => {
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { Moralis, enableWeb3, authenticate, isAuthenticated, isAuthenticating, authError, user } = useMoralis();
  // state variable
  const[userDescription, setUserDescription] = useState<any>({value: ""})
  const[usersImgUrl, setusersImgUrl] = useState<any|File>({value: ""})
  const[userNftName, setUserNftName] = useState<any>({value: ""})
  const[tokenURI, setTokenURI] = useState<any>({value: ''})
  // an array which holds our meta values
  let ipfsArray:any = [];
  const contractAddress = (process.env.REACT_APP_DEPLOYED_CONTRACT as string)

  useEffect( () => {if(isAuthenticated){ enableWeb3()}}, [isAuthenticated])

  //handle file upload/save to ipfs
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
  // input handlers
  const nameOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setUserNftName({value: event.target.value})
  }
  const descOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setUserDescription({value: event.target.value})
  }
// construct the metadata array and post to ipfs
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

  // calls a hook to handle the contract interaction with mint  useSetTokenUri
  const {handleMint, txID} = useCallMint(contractAddress)

  // calls a hook to set token URI for user mint
  const {handleSetTokenUri, tokenUriState} = useSetTokenUri(
    contractAddress,
    (txID.status as any),
    tokenURI.data ? (tokenURI.data[0].path as any) : '',
    )

    /*
      We want to make this into a 3 step flow. Use of spinners, loading bars or whatever seems fit to make
      this experience feel as smooth as possible.
      1. enter and submit meta data
      2. mint your token
      3. set your tokenURI
    */
  return (
    <div id="app-inner">
      <MintagramNavbar />
      <div
        id="create-mint"
        className="standard-view">
        <Container
          className="view-inner"
          >
          <h4>Upload your image</h4>
          <input accept=".png, .jpg, .jpeg" type="file" onChange={saveImageToIPFS} />
          <h4>Set your meta data</h4>
          <Form>
            <Form.Group className="mb-3" controlId="userNftName">
              <Form.Label>Name:</Form.Label>
                <Form.Control type="textarea" placeholder="Name your mint" onChange={nameOnChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="userDesc">
              <Form.Label>Describe your photo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Describe the mint"
                  onChange={descOnChange}/>
            </Form.Group>
              <Button variant="primary" type="button" onClick={handleMeta}>Submit</Button>
          </Form>
          <h4>Create token</h4>
          <Button onClick={handleMint}>Mint</Button>
          <h4>Set token uri</h4>
          <Button onClick={handleSetTokenUri}>Set URI</Button>
        </Container>
      </div>
    </div>
  )
}
