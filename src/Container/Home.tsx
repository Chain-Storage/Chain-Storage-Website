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

  // request access to the user's MetaMask account
  async function requestAccount() {
    console.log(window.ethereum.selectedAddress);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  return (
    <div>
      <header>
        <h1>Welcome to Chain Storage</h1>
        <button onClick={requestAccount}>Login</button>
      </header>

      <Link to="/profile/">Go Proile</Link>
    </div>
  );
}
