import  {useMoralis} from "react-moralis"
import StandardAuction from "../abi/StandardAuction.json";
import { useState } from "react";
import { Uint256 } from "soltypes";

export const useStdBid = (contractAddress: string, nft: string, tokenId: any) => {
  const {Moralis} = useMoralis()
  const[auctionBidState, setAuctionBidState] = useState<any>({status: ""})
  const {abi} = StandardAuction;
  
  const handleStdBid = async () => {
    
    setAuctionBidState({status: "setting your token URI"})
    
    const opts = {
      chain: "rinkeby",
      contractAddress: contractAddress,
      functionName: "bid",
      params: {nft, tokenId},
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
    setAuctionBidState({status: auctionBidState.status.value})
  } 
return {handleStdBid, auctionBidState} 
}