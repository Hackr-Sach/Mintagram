import  {useMoralis} from "react-moralis"
import Mint_A_Gram from ".././abi/Mint_A_Gram.json";
import { useState } from "react";
import { Uint256 } from "soltypes";

export const useCallMint = (contractAddress: string) => {
  const {Moralis, enableWeb3} = useMoralis()
  const[txID, setTxID] = useState<Uint256 | any>(0)
  const {abi} = Mint_A_Gram;

  const handleMint = async () => {
    //let lottery_fee = await (Moralis as any).executeFunction({functionName: "_lottoFee"}
    const opts:any =  {
      chain: "rinkeby",
      contractAddress: contractAddress,
      functionName: "mintImage",
      abi: abi,
      msgValue: "1"  
    }

    const mintImage = await (Moralis as any).executeFunction(opts)
    .then( (data: any) => {
      setTxID({status: data.events.TransferSingle.returnValues.id})
    }).catch((error: any) => {
      console.log("error ->  ", error)
    });

    if(mintImage != null || undefined)
    setTxID({status: mintImage.events.TransferSingle.returnValues.id})
    

  } 
console.log(txID)
return {handleMint, txID} 
}
