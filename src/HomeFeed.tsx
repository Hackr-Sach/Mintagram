
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Container, Button } from "react-bootstrap";
import { MintagramNavbar } from "./components/Navbar";
import $ from 'jquery';

export const Home = () => {
const { Moralis, enableWeb3, isAuthenticated, authError} = useMoralis();
useEffect( () => {if(isAuthenticated){ enableWeb3()}}, [isAuthenticated])

// Get nft's
const getNFTs = async() => {
    const options:any = {
        chain: 'rinkeby',
        address: '0x814ddd96fa03f46352c4a2c5787b4836408477fc'
    }
    const nfts = await Moralis.Web3.getNFTs(options);
    console.log(nfts);
    nfts.forEach( (nft) => {
        let url:string|undefined = fixURL(nft.token_uri);
        if(url)
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data.image || data.name || data.description){ //erc1155 most likely
                    $("div.content").html($("div.content").html() + "<img src="+data.image+"/>")
                    $("div.content").html($("div.content").html() + "<h3>"+ data.name +"</h3>")
                    $("div.content").html($("div.content").html() + "<p>"+ data.description +"</p>")
                }
                if(data.token_uri && data.name){ //erc1155 most likely
                    $("div.content").html($("div.content").html() + "<img src="+data.token_uri+"/>")
                    $("div.content").html($("div.content").html() + "<h3>"+ data.name +"</h3>")
                }
                
                return (data.json as any)
            })
            .catch( err => console.log(err))
    })

}

function fixURL(url:string|null){
    try{
        if(url)
        if(url.startsWith("ipfs"))
            return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://ipfs/").slice(-1)
        
            return url+"?format=json" 
        
      
    } catch {
        console.log("something wrong in fixURL")
    }   
}

    return(
        <div>
            <Container>
                <h1>Home Feed</h1>
                <Button onClick={getNFTs}>get nft's</Button>
                <div className='content'></div>
            </Container>
        </div>  
    );
}