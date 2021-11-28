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
                $("div.homeFeedContent").html($("div.homeFeedContent").html() + "<div class='card'>" + "<img src='" + data.image + "' /> <h3>" + data.name + "</h3>" + "<p>" + data.description + "</p>" + "</div > ")
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
        <div
          className="search-bar"
          >
            <label className="searchLabel" htmlFor="">Search </label>
            <input type="text" onChange={typedSearchOnChange} onKeyDown={getNFTs}/>
            <div
              className="ui-icon ui-icon-small svg-wrapper">
              <svg
                viewBox="0 0 32 32"
                fill="#000"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                  d="M29 27.586L21.448 20.034C23.2628 17.8553 24.1678 15.0608 23.9747 12.2319C23.7816 9.40297 22.5052 6.75739 20.4112 4.84552C18.3172 2.93364 15.5667 1.90268 12.732 1.96709C9.89717 2.0315 7.19635 3.18633 5.19133 5.19134C3.18632 7.19635 2.03149 9.89717 1.96708 12.732C1.90267 15.5667 2.93363 18.3172 4.84551 20.4112C6.75738 22.5053 9.40296 23.7816 12.2319 23.9747C15.0608 24.1678 17.8553 23.2628 20.034 21.448L27.586 29L29 27.586ZM3.99999 13C3.99999 11.22 4.52783 9.47991 5.51677 7.99987C6.5057 6.51983 7.91131 5.36627 9.55584 4.68509C11.2004 4.0039 13.01 3.82567 14.7558 4.17293C16.5016 4.5202 18.1053 5.37737 19.364 6.63604C20.6226 7.89471 21.4798 9.49836 21.8271 11.2442C22.1743 12.99 21.9961 14.7996 21.3149 16.4442C20.6337 18.0887 19.4802 19.4943 18.0001 20.4832C16.5201 21.4722 14.78 22 13 22C10.6139 21.9974 8.32621 21.0483 6.63896 19.361C4.9517 17.6738 4.00264 15.3861 3.99999 13V13Z"
                  fill="#000"/>
              </svg>
            </div>
          </div>
      </Container>

      <Container >
        <div
          id="gallery"
          className="gallery gallery-view">
          <div
            id="homeFeedContent"
            className="feed-view card-list">
          </div>
        </div>
      </Container>
    </div>
  );
}
