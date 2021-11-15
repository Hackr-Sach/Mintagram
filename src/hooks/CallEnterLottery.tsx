import  {useMoralis} from "react-moralis"
import Mint_A_Gram from ".././abi/Mint_A_Gram.json";
import { useState } from "react";
const contractAddress = process.env.REACT_APP_DEPLOYED_CONTRACT

export const useEnterLottery = () => {

  const {Moralis} = useMoralis()
  const[entryState, setEntryState] = useState<any>({status: ""})
  const {abi} = Mint_A_Gram;

  const handleLottoEntry = async () => {
    setEntryState({status: "entering"})
    const opts:any =  {
      chain: "rinkeby",
      contractAddress: contractAddress,
      functionName: "enterLottery",
      abi: abi,
      msgValue: "1"  
    }

    const enterLottery = await (Moralis as any).executeFunction(opts).catch((error: any) => {
      console.log("error ->  ", error)
    });

    if(enterLottery != null || undefined)
    setEntryState({status: enterLottery.status})
    
  } 

return {handleLottoEntry, entryState} 
}
