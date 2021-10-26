import React, { useState } from "react";
import { Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Input } from "@chakra-ui/react";
import { useMoralisFile } from "react-moralis";
import axios from "axios";


/*
  todo: call mintImage with tokenURI aka ipfs url?
*/

export const UploadMint = () => {
  const [localFile, setLocalFile] = useState<File|null>(null);
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();

  const handleUpload = () => {
    if (localFile) {
      saveFile("upload.png", localFile, { saveIPFS: true });
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) 
      setLocalFile(event.currentTarget.files[0]);
      
      let ipfsArray: any[] | undefined = [];
    
      for(let i = 0; i < 6; i++){
        //let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + i.toString(16).substr(-64));
        ipfsArray.push({
          path: `metadata/${i}.json`,
          content: {
            image: `ipfs://Qmek3VSvD3NTeGvfA1HAo4H4xgknvJn3zPzrkQQmrpKsww/images/${i}`,
            name: `test - ${i}`,
            description: "testing testing 123 come test your meta data woth me",
          }
        })
      } 
        axios.post("https://deep-index.moralis.io/api/v2/ipfs/uploadFolder", 
            ipfsArray,
            {
                headers: {
                    "X-API-KEY": '',
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
  }

  return (
    <div>
      <Stack spacing={6}>
        <Heading>File</Heading>
        <Box>
          <Input accept=".png, .jpg, .jpeg" type="file" onChange={handleChange} />
          <Button onClick={handleUpload}>Upload</Button>
        </Box><p>
          {JSON.stringify(
            {
              error,
              isUploading,
              moralisFile,
              hash: moralisFile ? (moralisFile as any).hash() : null,
              ipfs: moralisFile ? (moralisFile as any).ipfs() : null,
            },
            null,
            2,
          )}</p>
       
      </Stack>
    </div>
    
  )
};