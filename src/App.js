import { useState } from "react";
import "./App.css";
import { ethers } from "ethers";

function App() {
  const [bytecode, setBytecode] = useState("");
  const [abi, setAbi] = useState("");
  const [address, setAddress] = useState("");
  const mountedStyle = { animation: "inAnimation 250ms ease-in" };
  const unmountedStyle = {
    animation: "outAnimation 270ms ease-out",
    animationFillMode: "forwards",
  };
  async function getContractAddress() {
    if (!bytecode || !abi || !window.ethereum) {
      alert("Please enter bytecode and ABI and connect to metamask");
      return;
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      const contract = await factory
        .deploy()
        .then((contract) => {
          const temp = contract.target;
          setAddress(temp);
          setAbi("");
          setBytecode("");
        })
        .catch((error) => {
          console.error(error);
          alert(error.reason);
        });
    }
  }
  function retry() {
    setAddress("");
  }
  return (
    <div id="main">
      {address ? (
        <div style={address ? mountedStyle : unmountedStyle}>
          <div className="field">Contract Deployed on - "{address}"</div>
          <button id="btn-2" onClick={retry}>
            TRY ANOTHER CONTRACT
          </button>
        </div>
      ) : (
        <div>
          <div className="field">
            <label>Bytecode</label>
            <input
              id="ti"
              placeholder="Enter bytecode"
              value={bytecode}
              onChange={(e) => {
                setBytecode(e.target.value);
              }}
            />
          </div>
          <div className="field">
            <label>ABI</label>
            <textarea
              id="ta"
              placeholder="Enter ABI"
              value={abi}
              onChange={(e) => {
                setAbi(e.target.value);
              }}
            />
          </div>
          <button onClick={getContractAddress} className="field" id="btn">
            GET CONTRACT ADDRESS
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
