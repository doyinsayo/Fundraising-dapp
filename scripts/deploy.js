const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    const Fundraiser = await ethers.getContractFactory("Fundraiser");

    // Correct way to define the beneficiary address as a string
    const beneficiaryAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Replace with actual address

    const fundraiser = await Fundraiser.deploy(beneficiaryAddress);

    await fundraiser.deployed();
    console.log("Fundraiser deployed to:", fundraiser.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error occurred during deployment:", error);
        process.exit(1);
    });