import  {useMoralis} from "react-moralis"
import Mint_A_Gram from "../abi/Mint_A_Gram.json";
import { useState } from "react";

export const useCallMint = (contractAddress: string, tempURI: string) => {

    const {Moralis} = useMoralis()
    const[mintState, setMintState] = useState<{}>({status: "waiting for mint"})
    const {abi} = Mint_A_Gram
      
      const handleMint = async () => {
        //let lottery_fee = await (Moralis as any).executeFunction({functionName: "_lottoFee"})
        setMintState({status: "Minting"})
        const opts: any = {
            chain: "0x4",
            address: contractAddress,
            function_name: "mintImage",
            abi: abi,
            params:{tempURI},
            msgValue: "test"  
        }

        const tx = await (Moralis as any).executeFunction(opts);

        setMintState({status: tx.status})
      } 

    return {handleMint, mintState} 
}