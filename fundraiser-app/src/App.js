import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundraiserABI from "./FundraiserABI.json";

const fundraiserAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';  // Replace with your actual contract address

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationAmount, setDonationAmount] = useState("");
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to enable Metamask
  const enableMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Metamask connected");
      } catch (error) {
        setErrorMessage("User denied account access.");
      }
    } else {
      setErrorMessage("Please install Metamask to use this dApp.");
    }
  };

  // Function to load blockchain data and set up account changes listener
  const loadBlockchainData = async () => {
    await enableMetamask(); // Ensure Metamask is connected

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(fundraiserAddress, FundraiserABI, signer);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        // Get the total donations and set the state
        const total = await contract.totalDonations();
        setTotalDonations(ethers.formatEther(total));

        // Set the current account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);

        // Listen for account changes
        window.ethereum.on('accountsChanged', async (accounts) => {
          const account = ethers.getAddress(accounts[0]);
          setAccount(account);
          console.log("Account changed to:", account);
        });

      } catch (error) {
        setErrorMessage("Error loading blockchain data. Make sure Metamask is connected.");
      }
    }
  };

  useEffect(() => {
    loadBlockchainData(); // Load data when the app initializes
  }, []);

  // Function to handle donations
  const donate = async () => {
    if (!contract) {
      setErrorMessage("Contract is not loaded. Make sure you are connected to the blockchain.");
      return;
    }
    
    try {
      const tx = await contract.donate({ value: ethers.parseUnits(donationAmount, "ether") });
      await tx.wait();

      const total = await contract.totalDonations();
      setTotalDonations(ethers.formatEther(total));
    } catch (error) {
      setErrorMessage("Donation failed. Make sure you have enough funds and Metamask is connected.");
    }
  };

  return (
    <div className="App">
      <h1>Fundraiser</h1>
      <p>Total Donations: {totalDonations} ETH</p>

      <input
        type="text"
        placeholder="Enter donation amount"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
      />

      <button onClick={donate}>Donate</button>

      {account && <p>Connected account: {account}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default App;
