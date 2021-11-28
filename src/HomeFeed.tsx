import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Container, Button} from "react-bootstrap";
import $ from 'jquery';
import "./HomeFeed.css";
import {fixURL} from "./helpers/fixURL"
import { MainNoticeAlert } from "./components/MainNoticeAlert";
import { useEnterLottery } from "./hooks";

export const Home = () => {
const { Moralis, enableWeb3, isAuthenticated, authError} = useMoralis();
useEffect( () => {if(isAuthenticated){ enableWeb3()}}, [isAuthenticated])
const[userTypedSearch, setUserTypedSearch] = useState<any>({value: ""})
const[NFTqueryResult, setNFTqueryResult] = useState<any>({value:""})

let allNFT = [{}]; // holding an array of all nft objects

const getNFTs = async() => {

// reset state and clear search results
setUserTypedSearch({value: ''});

$("div.homeFeedContent").html('')
// query args
const options:any = { q: userTypedSearch.value, chain: "rinkeby", filter: "name,description,attributes", limit: 25 };
// query call + populating elements with result.
await Moralis.Web3API.token.searchNFTs (options).then( res => {
    if(res.result != undefined)
    res.result.forEach( (nft: { token_uri: string | null; }) => {
      let url:string|undefined = fixURL(nft.token_uri);
      if(url)
        fetch(url)
          .then(res => res.json())
          .then(data => {
            if(data.image || data.name || data.description){ 
              $("div.homeFeedContent").html($("div.homeFeedContent").html() + "<img width=300 height=300 src="+data.image+"/>")
              $("div.homeFeedContent").html($("div.homeFeedContent").html() + "<h3>"+ data.name +"</h3>")
              $("div.homeFeedContent").html($("div.homeFeedContent").html() + "<p>"+ data.description +"</p>")
              
            }
          setNFTqueryResult(data) // setting the state
          allNFT.push((NFTqueryResult as any))  // pushing the state to an array
          //console.log(allNFT)   // Log of allNFT
          return (data.json as any)
            })
          .catch( error => console.log(error))})    
  })
  .catch( error => {console.log(error);});
}
// event handler
const typedSearchOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setUserTypedSearch({value: event.target.value})
  }
// hook handles contract function call.
const {handleLottoEntry, entryState} = useEnterLottery()


console.log(allNFT)
    return(
        <div>
          <div className='HomeBanner'>  {/* maybe temp? */}
          <p className="BannerMessage">Mintagram (BETA)</p>
           <Button className="BannerEnterLottery" onClick={handleLottoEntry}>Buy Lottery Ticket</Button>
          </div>
          
          <Container fluid>
          <div className='profileHeader'></div>
          </Container>
         
          <Container fluid>
              <label className="searchLabel" htmlFor="">Search </label>
              <input type="text" onChange={typedSearchOnChange} onKeyDown={getNFTs}/>
          </Container>         
        
          <Container >
            <div className="encapsulated">
              <div>
              <div className='homeFeedContent'></div>
              </div>  
            </div>
         </Container>
        </div>  
    );
}