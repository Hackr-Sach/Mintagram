
export const fixURL = (url:string|null) =>{
    try{
        if(url)
        if(url.startsWith("ipfs"))
          return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://ipfs/").slice(-1)
        return url+"?format=json" 
    } catch {
        console.log("something wrong in fixURL")
    }   
}