const { expect } = require("chai");

describe("Fundraiser", function () {
  let fundraiser, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    fundraiser = await Fundraiser.deploy(owner.address);
  });

  it("should allow donations", async function () {
    await fundraiser.connect(addr1).donate({ value: ethers.utils.parseEther("1") });
    expect(await fundraiser.totalDonations()).to.equal(ethers.utils.parseEther("1"));
  });

  it("should allow the owner to withdraw funds", async function () {
    await fundraiser.connect(addr1).donate({ value: ethers.utils.parseEther("1") });
    const initialBalance = await ethers.provider.getBalance(owner.address);
    await fundraiser.withdraw();
    const newBalance = await ethers.provider.getBalance(owner.address);
    expect(newBalance).to.be.above(initialBalance);
  });
});
