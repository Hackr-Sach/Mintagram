import  {useMoralis} from "react-moralis"
import StandardAuction from "../abi/StandardAuction.json";
import { useState } from "react";

export const useGetAuction = (contractAddress: string, nft: any, tokenId: string) => {
  const {Moralis} = useMoralis()
  const[auctionGetterState, setAuctionGetterState] = useState<any>({status: ""})
  const {abi} = StandardAuction;

  const handleGetAuction = async () => {
    
    setAuctionGetterState({status: "setting your token URI"})
    
    const opts = {
      chain: "rinkeby",
      contractAddress: contractAddress,
      functionName: "setTokenURI",
      params: {nft, tokenId},
      abi: abi,
      msgValue: "2"  
    }

    const getAuction = await (Moralis as any).executeFunction(opts)
    .then( (res: { data: any; }) => {
      console.log(res)
    }).catch((error: any) => {
      console.log("error ->  ", error)
    });

    if(getAuction != null || undefined)
    setAuctionGetterState({status: auctionGetterState.status.value})
  } 
return {handleGetAuction, auctionGetterState} 
}