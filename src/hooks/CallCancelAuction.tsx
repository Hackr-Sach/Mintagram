import  {useMoralis} from "react-moralis"
import StandardAuction from "../abi/StandardAuction.json";
import { useState } from "react";

export const useCancelAuction = (contractAddress: string, nft: string, tokenId: any) => {
  const {Moralis} = useMoralis()
  const[cancelAuctionState, setCancelingAuctionState] = useState<any>({status: ""})
  const {abi} = StandardAuction;

  const handleCancelAuction = async () => {
    
    setCancelingAuctionState({status: "Canceling Auction"})
    
    const opts = {
      chain: "rinkeby",
      contractAddress: contractAddress,
      functionName: "cancelAuction",
      params: {nft, tokenId},
      abi: abi,
      msgValue: "2"  
    }

    const cancelAuction = await (Moralis as any).executeFunction(opts)
    .then( (res: { data: any; }) => {
      console.log(res)
    }).catch((error: any) => {
      console.log("error ->  ", error)
    });

    if(cancelAuction != null || undefined)
    setCancelingAuctionState({status: cancelAuctionState.status.value})
  } 
return {handleCancelAuction, cancelAuctionState} 
}