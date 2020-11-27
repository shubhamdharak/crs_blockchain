pragma solidity ^0.5.0;

contract Schemes {
    string public name;
    string public date;
    bool public complated=false;
    string public description;
    address public contractor;
    uint public cost;

    function getScheme() view public returns(string memory)  {
        return name;
    }

    function setName(string memory  _name) public {
        name= _name;
    }

    
    function setScheme( string memory _name,  string memory _date, bool   _complated,  string memory  _description, address   _contractor,  uint   _cost) public {
        name = _name;
        date = _date;
        complated = _complated;
        description = _description;
        contractor = _contractor;
        cost = _cost;
    }
    
    function get() view public returns(string memory,uint,string memory,bool,string memory,address){
        return (name,cost,date,complated,description,contractor);
    }
    
}