import React, { useState, useEffect } from "react";
import {Button, Stack, Container} from 'react-bootstrap'
import { MintagramNavbar } from "./components/Navbar";
import { useMoralis, useMoralisFile } from "react-moralis";
import axios from "axios";
import { useCallMint } from "./hooks";

// add multiple file support. for now single is fine.
// fix data race File uploads [] 
// resolve and confirm consitent image urls [X]
// move headers api-key into .env [x]
// user meta data inputs:Description []
// resolve mintImage contract interaction [in progress]

export const UploadMint = () => {
  let contractAddr:any = "0x315619e6773A8ef721a4956e2b5F24cF582FE44c";
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { enableWeb3, authenticate, isAuthenticated, isAuthenticating, authError} = useMoralis();
  const [tempURI, setTempURI] = useState<any>({path: ''});
  const {handleMint, mintState} = useCallMint(contractAddr, tempURI)
  //handling image & metadata IPFS start
  const handleImgMeta = async (event: React.ChangeEvent<HTMLInputElement>) => {  
    let ipfsArray:any = [];
    if (event.currentTarget.files && event.currentTarget.files[0] != null) {
      let fileName = event.currentTarget.files[0]
       .name.replace(".png", '').replace(".jpeg", '').replace(".jpg", '')

      await saveFile(event.currentTarget.files[0].name, event.currentTarget.files[0], { saveIPFS: true })
        .then((res) => {
          if(res != undefined)
          ipfsArray.push({
            path: `metadata/${fileName}.json`,
              content: {
                image: `${moralisFile == null ? "No image to show" : res?._url}`,
                name: `${fileName}`,
                description: "testing testing 123 ",
              }
            })
          })
          .catch( (error) => {
            console.log(error)
          }) 
          axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
          ipfsArray,
            {
              headers: {
              "X-API-KEY": 'Moralis_API_KEY',
              "Content-Type": "application/json",
              "accept": "application/json"
              } 
            }).then( (res) => {
              if(res.data[0].path)
              setTempURI({path: res.data[0].path as any}) 
              console.log(res.data)
              console.log(tempURI.path)
              
            }).catch ( (error) => {
              console.log(error)
            })   
      }
  }

  useEffect( () => {if(isAuthenticated){ enableWeb3()}}, [isAuthenticated])
  return (
<<<<<<< Updated upstream
    <div>
      <Stack>
        <h1>File</h1> 
        <Container>
          <input accept=".png, .jpg, .jpeg" type="file" onChange={handleImgMeta} />
          <Button onClick={handleMint}>Mint</Button>
        </Container>
      </Stack>
      <MintagramNavbar />
=======
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
>>>>>>> Stashed changes
    </div>
    
    
  )
};




