import React, { useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Input } from "@chakra-ui/react";
import { useMoralis, useMoralisFile } from "react-moralis";
import axios from "axios";


// add multiple file support. for now single is fine.
// fix data race File uploads [] 
// resolve and confirm consitent image urls [X]
// move headers api-key into .env [x]
// user meta data inputs:Description []
// resolve mintImage contract call

export const UploadMint = () => {
  const [localFile, setLocalFile] = useState<File|null>(null);
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { Moralis } = useMoralis();
  
  //handling image & metadata IPFS start
  const handleImgMeta = async (event: React.ChangeEvent<HTMLInputElement>) => {  
    let ipfsArray:any = [];
      if (event.currentTarget.files) {
        setLocalFile(event.currentTarget.files[0]);
        if (event.currentTarget.files[0] != null) { 
          //console.log()
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
          .then(() => {
            axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
            ipfsArray,
              {
                headers: {
                "X-API-KEY": 'Moralis_API_KEY',
                "Content-Type": "application/json",
                "accept": "application/json"
                } 
              }).then( (res) => {
                console.log(res.data);
              }).catch ( (error) => {
                console.log(error)
              }) 
          })
          .catch( (error) => {
            console.log(error)
          }) 
        }
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
    await Moralis.Web3API.native.runContractFunction(opts);
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
