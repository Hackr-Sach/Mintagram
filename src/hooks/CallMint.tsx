import  {useMoralis} from "react-moralis"
import Mint_A_Gram from ".././abi/Mint_A_Gram.json";
import { useState } from "react";

export const useCallMint = (contractAddress: string) => {
  const {Moralis, enableWeb3} = useMoralis()
  const[mintState, setMintState] = useState<any>({status: "waiting for mint"})
  const {abi} = Mint_A_Gram;

  const handleMint = async () => {
    //let lottery_fee = await (Moralis as any).executeFunction({functionName: "_lottoFee"}
    setMintState({status: "Minting"})
    const opts:any =  {
      chain: "rinkeby",
      contractAddress: contractAddress,
      functionName: "mintImage",
      abi: abi,
      msgValue: "1"  
    }

    const mintImage = await (Moralis as any).executeFunction(opts)
    .then( (res: { data: any; }) => {
      console.log(mintState.status)
      console.log(res)
    }).catch((error: any) => {
      console.log("error ->  ", error)
    });

    if(mintImage != null || undefined)
    setMintState({status: mintImage.status})
    
  } 

return {handleMint, mintState} 
}
