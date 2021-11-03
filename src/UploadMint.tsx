import React, { useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Input } from "@chakra-ui/react";
import { useMoralis, useMoralisFile } from "react-moralis";
import axios from "axios";


// {todo} add multiple file support. for now single is fine.
// fix data race on moralisFile uploads
// resolve and confirm consitent in image urls (seems like ipfs() call is returning random images?)
// move headers api-key into .env
// user meta data inputs

export const UploadMint = () => {
  const [localFile, setLocalFile] = useState<File|null>(null);
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { Moralis } = useMoralis();
  
  //handling image & metadata IPFS start
  const handleImgMeta = async (event: React.ChangeEvent<HTMLInputElement>) => {  
    let ipfsArray;
    try{
      if (event.currentTarget.files && localFile) {
        setLocalFile(event.currentTarget.files[0]);
        if (event.currentTarget.files[0]) {  
          await saveFile(event.currentTarget.files[0].name, event.currentTarget.files[0], { saveIPFS: true })
            .then( (res) => {
              console.log(res?._url)
              ipfsArray.push({
                path: `metadata/${localFile.name}.json`,
                content: {
                  image: `${moralisFile == null ? "No image to show" : res?._url}`,
                  name: `${localFile.name}`,
                  description: "testing testing 123 ",
                }
              })
            })
            .catch( (error) => {
                console.log(error)
            }); 
            
        }
      }
    } catch(e) {
      console.log(e)
    }
    try{
      axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
      ipfsArray,
        {
          headers: {
          "X-API-KEY": 'pv0p5n9Kr0tsWlGizTZWTfGiU1ubIRYTi96kZJIOM7iXy4Lhi00mnkqvWQWxYhBh',
          "Content-Type": "application/json",
          "accept": "application/json"
          } 
        } 
      ).then( (res) => {
        console.log(res.data);
      })
      .catch ( (error) => {
        console.log(error)
      })
    } catch(e) {
      console.log(e)
    }
      
  }
  //handling image & metadata IPFS end
  // handling mint start
  const ABI:any[] = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        }
      ],
      "name": "mintImage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    }
  ];
  const opts: any = {
    chain: "0x4",
    address: "0x388D7BDc923BAd5792fF3B0F477AA59E0d53406E",
    function_name: "mintImage",
    abi: ABI,
  }
  const handleMint = async () => {
    
    try {
      Moralis.Web3API.native.runContractFunction(opts);
    } catch (error) {
      console.log(error)
    }
  }
  // handling mint end

  return (
    <div>
      <Stack spacing={6}>
        <Heading>File</Heading>
        <Box>
          <Input accept=".png, .jpg, .jpeg" type="file" onChange={handleImgMeta} />
          <Button onClick={handleMint} >Mint</Button>
        </Box>
       
      </Stack>
    </div>
    
  )
};
