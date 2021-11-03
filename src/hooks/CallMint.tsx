import  {useMoralis} from "react-moralis"
import { useState } from "react";

export const CallMint = (contractAddress: string) => {

    const {Moralis} = useMoralis()
    const[mintState, setMintState] = useState<{}>({status: null})
    const ABI:any[] = [{
          "inputs": [
            {
              "internalType": "string",
              "name": "tokenURI",
              "type": "string"
            }
          ],
          "name": "mintImage",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "payable",
          "type": "function"
        }];

      const handleMint = async () => {
        let lottery_fee = await (Moralis as any).executeFunction({functionName: "lottory_fee"})
        setMintState({status: "Mining"})
        const amount = 1
        const opts: any = {
            chain: "0x4",
            address: contractAddress,
            function_name: "mintImage",
            abi: ABI,
            params:{amount},
            msgValue: lottery_fee * amount   
        }
        let tx = await (Moralis as any).executeFunction(opts)
        setMintState({status: (tx as any).status})
      } 

    return {handleMint, mintState} 
}