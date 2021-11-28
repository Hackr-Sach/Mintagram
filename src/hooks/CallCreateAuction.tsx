import  {useMoralis} from "react-moralis"
import StandardAuction from "../abi/StandardAuction.json";
import { useState } from "react";

export const useCreateAuction = (
      contractAddress: string, 
      _nft: string ,
      _tokenId: any ,
      _seller: string ,
      _startPrice: any,
      _duration: any,
      _startedAt: any,
      _highestBid: any,
      _highestBidder: string
      ) => {

      const {Moralis} = useMoralis()
      const[auctionCreationState, setAuctionCreationState] = useState<any>({status: ""})
      const {abi} = StandardAuction;

      const handleCreateAuction = async () => {
    
      setAuctionCreationState({status: "Creating Auction"})
    
      const opts = {
        chain: "rinkeby",
        contractAddress: contractAddress,
        functionName: "createAuction",
        params: {_nft, _tokenId, _seller, _startPrice, _duration, _startedAt, _highestBid, _highestBidder},
        abi: abi,
        msgValue: "2"  
      }
      console.log(_nft)
      console.log(_tokenId)
      console.log(_seller)
      console.log(_startPrice)
      console.log(_duration)
      console.log(_startedAt)
      console.log(_highestBid)
      console.log(_highestBidder)
      const createAuction = await (Moralis as any).executeFunction(opts)
        .then( (res: { data: any; }) => {
          console.log(res.data)
        }).catch((error: any) => {
          console.log("error ->  ", error)
        });

      if(createAuction != null || undefined)
        setAuctionCreationState({status: auctionCreationState.status.value})
    } 
  return {handleCreateAuction, auctionCreationState} 
}
