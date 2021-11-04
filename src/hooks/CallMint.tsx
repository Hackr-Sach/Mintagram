import  {useMoralis} from "react-moralis"
import { useState } from "react";

export const CallMint = (contractAddress: string) => {

    const {Moralis} = useMoralis()
    const[mintState, setMintState] = useState<{}>({status: null})
    const ABI:any[] = [{
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
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
        //let lottery_fee = await (Moralis as any).executeFunction({functionName: "_lottoFee"})
        setMintState({status: "Mining"})
        const _msgSender = Moralis.User.current()
        const _tokenURI = "https://ipfs.moralis.io:2053/ipfs/Qmf7mLDeaUABSDA6wcJpwXSZQuDuUJURtwyAU4h6Dnxcr5/metadata/broc.json"  // At this point the data is already on IPFS. I need to GET the correct tokenURI to set here.
        const opts: any = {
            chain: "0x4",
            address: contractAddress,
            function_name: "mintImage",
            abi: ABI,
            params:{_msgSender, _tokenURI},
            msgValue: null//lottery_fee * amount   
        }
        let tx = await (Moralis as any).executeFunction(opts)
        setMintState({status: (tx as any).status})
      } 

    return {handleMint, mintState} 
}