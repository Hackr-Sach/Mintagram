import React, { useState } from "react";
import { Heading, Stack } from "@chakra-ui/layout";
import { Box, Button, Input } from "@chakra-ui/react";
import { useMoralisFile } from "react-moralis";
import axios from "axios";

// {todo} add multiple file support. for now single is fine.

export const UploadMint = () => {
  const [localFile, setLocalFile] = useState<File|null>(null);
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();

  const handleUpload = () => {
    let ipfsArray: any[] | undefined = [];
    if (localFile) {
      saveFile(localFile.name, localFile, { saveIPFS: true });
        ipfsArray.push({
          path: `images/${localFile.name}`,
          content: localFile.arrayBuffer  // not correct images are loading corrupt
        })}
  
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
}

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      setLocalFile(event.currentTarget.files[0]);
      
      let ipfsArray: any[] | undefined = [];
    
      //for(let i = 0; i < 6; i++){
        //let paddedHex = ("0000000000000000000000000000000000000000000000000000000000000000" + i.toString(16).substr(-64));
        ipfsArray.push({
          path: `metadata/${event.currentTarget.files[0].name}.json`,
          content: {
            image: `ipfs://QmfU7GJmNnULJ2YRfGyECAT1jWHnXWW1oeszLgV3Ls7Shy/images/${event.currentTarget.files[0].name}`,
            name: `test - ${event.currentTarget.files[0].name}`,
            description: "testing testing 123 come test your meta data woth me",
          }
        })
      //} 
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
    }
      
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


