import { useEffect, useState } from "react";
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

declare let window: any;

export function Home(): JSX.Element {
  useEffect(() => {
    if (typeof window.ethereum.selectedAddress !== "undefined") {
      window.location.href = "/profile";
    }
  });

  const [greeting, setGreetingValue] = useState();
  const greeterAddress: string = "0xAa499672AbBb77dCEFB21493CB95092F4FE40F9B";

  // request access to the user's MetaMask account
  async function requestAccount() {
    console.log(window.ethereum.selectedAddress);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
        console.log(window.ethereum.selectedAddress);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
      window.location.reload(true);
    }
  }

  return (
    <div>
      <header>
        <button onClick={requestAccount}>Login</button>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e: any) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
        />
      </header>

      <Link to="/profile/">Go Proile</Link>
    </div>
  );
}
