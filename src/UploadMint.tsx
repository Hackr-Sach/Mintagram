import React, { useState, useEffect } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import axios from "axios";
import { Divider, Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Input } from "@chakra-ui/react";
import { useCallMint } from "./hooks";

// add multiple file support. for now single is fine.
// fix data race File uploads [] 
// resolve and confirm consitent image urls [X]
// move headers api-key into .env [x]
// user meta data inputs:Description []
// resolve mintImage contract interaction [in progress]

export const UploadMint = () => {
  let contractAddr:any = "0xD6A9c9D318B24fB65a9CF977bdb874506D532743";
  let testTURI:any = "https://ipfs.moralis.io:2053/ipfs/Qmf7mLDeaUABSDA6wcJpwXSZQuDuUJURtwyAU4h6Dnxcr5/metadata/broc.json";
  const [tempURI, setTempURI] = useState<any>({path: ''});
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { enableWeb3, authenticate, isAuthenticated, isAuthenticating, authError} = useMoralis();

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
    <div>
      <Stack spacing={6}>
        <Heading>File</Heading>
        <Box>
          <Input accept=".png, .jpg, .jpeg" type="file" onChange={handleImgMeta} />
          <Button onClick={handleMint}>Mint</Button>
        </Box>
       
      </Stack>
    </div>
    
  )
};




