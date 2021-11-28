import  {useMoralis} from "react-moralis"
import StandardAuction from "../abi/StandardAuction.json";
import { useState } from "react";

export const useGetAuctions = (contractAddress: string) => {
  const {Moralis} = useMoralis()
  const[auctionsGetterState, setAuctionsGetterState] = useState<any>({status: ""})
  const {abi} = StandardAuction;

  const handleGetAuctions = async () => {
    
    setAuctionsGetterState({status: "getting auctions"})
    
    const opts = {
      chain: "rinkeby",
      contractAddress: contractAddress,
      functionName: "getAuctions",
      params: {},
      abi: abi,
      msgValue: "2"  
    }

    const getAuctions = await (Moralis as any).executeFunction(opts)
    .then( (res: { data: any; }) => {
      console.log(res.data)
    }).catch((error: any) => {
      console.log("error ->  ", error)
    });

    if(getAuctions != null || undefined)
    setAuctionsGetterState({status: getAuctions.value})
  } 
return {handleGetAuctions, auctionsGetterState} 
}