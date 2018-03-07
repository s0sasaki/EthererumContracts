pragma solidity ^0.4.7;

contract Betting{
    address public manager;
    uint public stake;
    uint public difficulty;

    function Betting() public payable{
        manager = msg.sender;
        stake = 1 ether;
        difficulty = 0;
    }
    function setDifficulty(uint new_difficulty) public{
        require(msg.sender == manager);
        require(difficulty <= new_difficulty);
        difficulty = new_difficulty;
    }
    function enter() public payable{
        require(msg.value > stake);
        stake += 1 ether;
        uint r = random() % 100;
        manager.transfer(stake * 5 /100);
        if(r >= difficulty){
            msg.sender.transfer(this.balance);
        }
    }
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now));
    }
}

