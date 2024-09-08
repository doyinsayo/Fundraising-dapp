// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Fundraiser is Ownable {
    struct Donation {
        address donor;
        uint amount;
        uint timestamp;
    }

    address public beneficiary;
    uint public totalDonations;
    Donation[] public donations;
    
    event DonationReceived(address indexed donor, uint amount, uint timestamp);
    event FundsWithdrawn(address indexed beneficiary, uint amount);

    constructor(address _beneficiary) Ownable(msg.sender) {
        beneficiary = _beneficiary;
    }

    // Accept donations
    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");

        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    // Withdraw funds by beneficiary
    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(beneficiary).transfer(balance);
        emit FundsWithdrawn(beneficiary, balance);
    }

    // Get donations count
    function getDonationsCount() public view returns (uint) {
        return donations.length;
    }

    // Get donation details
    function getDonation(uint index) public view returns (address, uint, uint) {
        Donation memory donation = donations[index];
        return (donation.donor, donation.amount, donation.timestamp);
    }
}
