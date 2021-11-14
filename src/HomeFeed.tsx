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

const getNFTs = async() => {
setUserTypedSearch({value: ''});
$("div.homeFeedContent").html('')
const options:any = { q: userTypedSearch.value, chain: "rinkeby", filter: "name,description,attributes", limit: 25 };
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
          return (data.json as any)
            })
          .catch( error => console.log(error))})    
  })
  .catch( error => {console.log(error);});
}
const typedSearchOnChange = (event: { target: { value: React.SetStateAction<{}>; }; }) => {
    setUserTypedSearch({value: event.target.value})
  }
const {handleLottoEntry, entryState} = useEnterLottery()
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
            <div className="gallery">
              <div className='homeFeedContent'></div>
            </div>
         </Container>
        </div>  
    );
}