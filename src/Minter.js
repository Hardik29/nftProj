import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT, setUri } from "./util/interact.js";

const Minter = () => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const [fileData, setfileData]  = useState("");
  const [Amount, setAmount] = useState(0);
  const [buttonvalue, setbuttonvalue] = useState("Mint NFT");
  const [count, setcount] = useState(0);
  const [nftData, setnftData] = useState([])
  const listItems = nftData.map((x) => <div className="listItems">
  <div className="flex: 1 1 auto">
  <h1 className="font-size: 1.125rem; line-height: 1.75rem; ">TokenID:{x.tokenId}</h1>
  <a href={x.tokenURI}>TokenURI@{x.tokenURI}</a>
  </div>
  <button className="listButton">Transfer Nft</button>
  </div>
  );
 
  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    setbuttonvalue("GENERATING URI ...........")
    const { success, tokenUri, status } = await setUri(fileData, name, description);
    setbuttonvalue("MInting NFT")
    setStatus(status);
    if (success) {
      const { success, status } = await mintNFT(Amount);
      setStatus(status)
      if (success) {
        setname("");
        setDescription("");
        setfileData("");
        setcount(count+1);
        const nftdatas = {
           tokenId:count,
           tokenURI:tokenUri
        }
        const newnftdatas = [nftdatas, ...nftData]
        setnftData(newnftdatas)
        setbuttonvalue("Minted!! MINT ANOTHER")
      }
    }
  };


 
  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <br></br>
      <p>
        Simply upload assest link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <div>
        <input type="file" onChange={(e) => setfileData(e.target.files[0])} />
        </div>
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setname(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
        <h2>🔢 Amount</h2>
         <input
          type="text"
          placeholder="e.g. Set Amoount Of Nft To Be Minted ;)"
          onChange={(event) => setAmount(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        {buttonvalue}
      </button>
      <p style={{ color: "red" }}>
        {status}
      </p>
      <p  style={{ color: "blue" }}>
        {"NO OF NFT MINTED::" + count}
      </p>
      <div>
      {listItems}
    </div>
    </div>
  );
};

export default Minter;

