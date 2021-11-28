import  {useMoralis} from "react-moralis"
import StandardAuction from "../abi/StandardAuction.json";
import { useState } from "react";


export const useWithdrawReturn = (contractAddress: string) => {
  const {Moralis} = useMoralis()
  const[withdrawState, setWithdrawState] = useState<any>({status: ""})
  const {abi} = StandardAuction;

  const handleWithdrawReturn = async () => {
    
    setWithdrawState({status: "Resolving your returns"})
    
    const opts = {
      chain: "kovan",
      contractAddress: contractAddress,
      functionName: "withdrawBid",
      params: {},
      abi: abi,
      msgValue: "2"  
    }

    const withdrawBid = await (Moralis as any).executeFunction(opts)
    .then( (res: { data: any; }) => {
      console.log(res)
    }).catch((error: any) => {
      console.log("error ->  ", error)
    });

    if(withdrawBid != null || undefined)
    setWithdrawState({status: withdrawState.status.value})
  } 
return {handleWithdrawReturn, withdrawState} 
}