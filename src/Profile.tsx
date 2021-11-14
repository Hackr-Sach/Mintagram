
import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Container} from "react-bootstrap";
import { MintagramNavbar } from "./components/Navbar";
import $ from 'jquery';
import "./Profile.css";
import { fixURL } from "./helpers/fixURL";

export const UserProfile = () => {
let ProfileImage = "https://toontimepod.files.wordpress.com/2018/06/yvon_frozen.jpg?w=1000&h=563";
let profileGalleryLoaded = false;
const { Moralis, enableWeb3, isAuthenticated, authError} = useMoralis();
useEffect( () => {if(isAuthenticated){ enableWeb3()}}, [isAuthenticated])
useEffect( () => {if(isAuthenticated && !profileGalleryLoaded){ getNFTs()}}, [isAuthenticated,profileGalleryLoaded])

const getNFTs = async() => {
  const options:any = {
      chain: 'rinkeby',
      address: '0xFb65A9e3B18abcF21F926e1C213887369EbF75Fd'
  }
  await Moralis.Web3.getNFTs(options)
  .then( res => {
    res.forEach( nft => {
      let url:string|undefined = fixURL(nft.token_uri);
      if(url)
        fetch(url)
          .then(res => res.json())
          .then(data => {
            if(data.image || data.name || data.description){ 
              $("div.profileContent").html($("div.profileContent").html() + "<img width=300 height=300 src="+data.image+"/>")
              $("div.profileContent").html($("div.profileContent").html() + "<h3>"+ data.name +"</h3>")
              $("div.profileContent").html($("div.profileContent").html() + "<p>"+ data.description +"</p>")
            }
          return (data.json as any)
            })
          .catch( error => console.log(error))})
    profileGalleryLoaded = true
  })
  .catch( error => {console.log(error);});
}

    return(
         <div>
         <MintagramNavbar />
         <Container>
          <div className='ProfileBanner'>
            <img className='ProfileImg' src={ProfileImage} alt="" />
            <p>about me</p>
          </div>
          
          <div className='profileHeader'></div>

          <div className="gallery">
            <div className='profileContent'></div>
          </div>      
         </Container>  
         </div>
    );
}