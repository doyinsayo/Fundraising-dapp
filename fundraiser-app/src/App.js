import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import FundraiserABI from "./FundraiserABI.json";

const fundraiserAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationAmount, setDonationAmount] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum); // Updated for v6
      const signer = await provider.getSigner(); // Changed to async in v6
      const contract = new ethers.Contract(fundraiserAddress, FundraiserABI, signer);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      const total = await contract.totalDonations();
      setTotalDonations(ethers.formatEther(total)); // Formatting changed slightly in v6
    };
    loadBlockchainData();
  }, []);

  const donate = async () => {
    const tx = await contract.donate({ value: ethers.parseUnits(donationAmount, "ether") }); // Updated for v6
    await tx.wait();
    const total = await contract.totalDonations();
    setTotalDonations(ethers.formatEther(total));
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
    </div>
  );
}

export default App;
