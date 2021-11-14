import  {useMoralis} from "react-moralis"
import Mint_A_Gram from ".././abi/Mint_A_Gram.json";
import { useState } from "react";
import { Uint256 } from "soltypes";

export const useSetTokenUri = (contractAddress: string, tokenId: Uint256, uri: string) => {
  const {Moralis} = useMoralis()
  const[tokenUriState, setTokenUriState] = useState<any>({status: "waiting for tokenURI"})
  const {abi} = Mint_A_Gram;
  const handleSetTokenUri = async () => {
    
    setTokenUriState({status: "setting your token URI"})
    
    const opts = {
      chain: "rinkeby",
      contractAddress: contractAddress,
      functionName: "setTokenURI",
      params: {tokenId,uri},
      abi: abi,
      msgValue: "2"  
    }

    const setTokenUri = await (Moralis as any).executeFunction(opts)
    .then( (res: { data: any; }) => {
      console.log(res)
    }).catch((error: any) => {
      console.log("error ->  ", error)
    });

    if(setTokenUri != null || undefined)
    setTokenUriState({status: tokenUriState.status.value})
    
  } 

return {handleSetTokenUri, tokenUriState} 
}
