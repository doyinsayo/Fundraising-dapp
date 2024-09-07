async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);
  
    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    const fundraiser = await Fundraiser.deploy(deployer.address);
    
    console.log("Fundraiser deployed to:", fundraiser.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  