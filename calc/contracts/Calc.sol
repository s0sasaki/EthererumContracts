pragma solidity ^0.4.17;

contract Calc{
    int32 public num;

    function Calc(int32 initialNum) public{
        num = initialNum;
    }

    function setNum(int32 newNum) public{
        num = newNum;
    }

    function sqNum() public returns (int32){
        return num * num;
    }
}
