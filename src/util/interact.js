import { pinJSONToIPFS } from "./pinatajson.js";
import { pinFileToIPFS } from "./pinatafile.js";
require("dotenv").config();
const alchemyKey = 'https://polygon-mumbai.g.alchemy.com/v2/LAxtjL6kOPLSwcUstpltj2V-e_D5Gv9z';
const contractABI = require("../contract-abi.json");
const contractAddress = "0xaD7175f28e5C99435177e23669232304899fE8b4";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);


export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const loadContract = () => {
  window.contract =  new web3.eth.Contract(contractABI, contractAddress);
  console.log(window.contract)
}



export const setUri = async (data, name, description) => {
  const pinataFileResponse = await pinFileToIPFS(data);
  console.log(pinataFileResponse);
  if (!pinataFileResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your Image.",
    };
  } else {
    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = pinataFileResponse.pinataUrl;
    metadata.description = description;

    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
      return {
        success: false,
        status: "😢 Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI = pinataResponse.pinataUrl;
    console.log(tokenURI);
    // window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    const transactionUriParameters = {
      to: contractAddress, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: window.contract.methods.setURI(tokenURI).encodeABI(),
    };

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionUriParameters],
      });
      return {
        success: true,
        tokenUri: tokenURI,
        status: "✅ TOKEN URI GENERATED!! Check out your transaction on Polygon Mumbai: https://mumbai.polygonscan.com/tx/" +
        txHash,
      };
    } catch (error) {
      return {
        success: false,
        status: "😥 Something went wrong: " + error.message,
      };
    }
  }
};

export const mintNFT = async (count, Amount) => {
  const transactionMintParameters = {
    to: contractAddress, // Required except during contract publications.
    from: window.ethereum.selectedAddress, // must match user's active address.
    data: window.contract.methods
      .mint(count, Amount)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionMintParameters],
    });
    return {
      success: true,
      status:
        "✅ NFT MINTED!!Check out your transaction on Polygon Mumbai: https://mumbai.polygonscan.com/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};

export const transferNFT = async (address, id, amount) => {
  const transactionTransferParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress, 
    data: window.contract.methods.transfer(address, id, amount).encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionTransferParameters],
    });
    return {
      success: true, 
      status:
        "✅ Transfer Happened!!Check out your transaction on Polygon Mumbai: https://mumbai.polygonscan.com/tx/" +
        txHash,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};
