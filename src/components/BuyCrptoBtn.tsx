import { Button } from "react-bootstrap";
import { useMoralis } from "react-moralis";


export const BuyCrypto = () => {
    const {Moralis} = useMoralis();
    function _buyCrypto(){
        (Moralis as any).Plugins.fiat.buy();
      }
    return(<Button onClick={_buyCrypto}>Buy Crpto</Button> );
}