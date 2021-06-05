pragma solidity  ^0.6.0;
pragma experimental ABIEncoderV2;

contract userContract {
    
    struct User {
        address addr;
        string name;
        string password;
    }
    User[] users;
  
    mapping(uint => User) public accounts;
    uint public userCount=0;
    
    // Schemes 
    struct Scheme {
        uint id;
        string name;
        string description;
        string date;
        address contractor;
        uint cost;
        uint256 createdAt;
        bool isAlloted;
    }
  
    mapping(uint => Scheme) public schemes;
    uint public schemeCount =0;
  
    // Material 
    struct Material {
        uint id;
        string name;
        address owner;
        uint price;
    }
    mapping(uint => Material) public materials;
    uint public materialCount=0;
  
    // Events for users
    event GetAddress(
        address addr,
        string name,
        string password
    );
    
    // Event for Scheme
    event Addscheme (
        uint id,
        string name,
        string description,
        string date,
        address owner,
        uint cost,
        uint256 createdAt
    );
    
    // Event for material 
    event AddMaterial(
        string name,
        address owner,
        uint price
    );
    
    // Operation for accounts
    function createAccount(address _addr, string memory  _name, string memory _password) public{
        require(bytes(_name).length >0);
        require(bytes(_password).length >0);
        User memory user = User(_addr, _name, _password);
        users.push(user);
        userCount++;
        accounts[userCount] = user;
        emit GetAddress(user.addr, user.name, user.password);
    }
    
    function checkAccount(string memory  _name) public view returns(bool) {
        for(uint i=0; i<users.length; i++) {
           if(keccak256(bytes(_name)) == keccak256(bytes(users[i].name))) {
               return true;
           } 
        }
        return false;
    }
    
    function updateUser(uint _id,string memory _name, string memory _password, address  _address) public returns (string memory,string memory,address)  {
        require(_id < 0 && _id > userCount, "Invalid user Id");
        require(_address != address(0x0), "Address should not be null");
        string memory name = accounts[_id].name = _name;
        string memory password = accounts[_id].password = _password;
        address addr = accounts[_id].addr = _address;
        return (name, password, addr);
    }
    
    // Operation for scheme / government employee
    function allSchemes() view public returns (Scheme[] memory){
        Scheme[] memory all = new Scheme[](schemeCount);
        for(uint i=0; i < schemeCount ; i++) {
            if(schemes[i+1].id != 0) {
                all[i] = schemes[i+1];
            } 
        }
        return all;
    }
    
    function getScheme(uint _id) view public returns(Scheme memory) { // string memory, string memory, address, uint
        require(_id >0);
        if(_id == schemes[_id].id ) {
            // return (schemes[_id].name, schemes[_id].date , schemes[_id].owner, schemes[_id].cost) ;
            return schemes[_id];
        }
        
    }
    
    function addScheme(string memory _name, string memory _date, string memory _description, uint  _cost) public {
        require(bytes(_name).length > 0 , "Name should not be null");
        // require(_owner != address(0x0), "Address should not be null"); for initial 0x0 must be owner
        require(_cost > 0, "Invalid cost");
        schemeCount++;
        
        // Add scheme to Scheme structure with mapping schemes
        schemes[schemeCount] = Scheme(schemeCount, _name,_description, _date, address(0), _cost, block.timestamp , false);
        emit Addscheme(schemeCount, _name,_description, _date, msg.sender, _cost, block.timestamp);
    }
    
    function removeScheme(uint  _id) public returns(string memory) {
        // require(_id >0 && _id <= schemeCount,"Not valid id");
        
        // check if scheme are available
        if(schemes[_id].id == _id) {
            delete schemes[_id];
            // schemeCount --;
            return "Scheme deleted!";
        } else {
            return "Scheme Not Found";
        }
    }
    
    function updateScheme(uint _id,string memory _name,string memory _description, string memory _date, uint  _cost) public returns(Scheme memory) {
        require(_id <= schemeCount, "Invalid scheme id");
        if(_id == schemes[_id].id) {
            schemes[_id] = Scheme(_id, _name, _description, _date, address(0), _cost, now , false);
            return schemes[_id];
        }
    }
    
    // Operation for vendors
    function addMaterial(string memory _name, address _owner, uint _price) public returns(bool) {
        require(bytes(_name).length > 0, "Name should not be null");
        require(address(_owner) != address(0), "Address should not be null");
        require(_price > 0, "Invalid cost");
        materialCount ++;
        materials[materialCount] = Material(materialCount, _name, _owner, _price);
        emit AddMaterial(_name, _owner, _price);
        return true;
    }
    
    function allMaterials() view public returns (Material[] memory){
        Material[] memory all = new Material[](materialCount);
        for(uint i=0;i< materialCount; i++ ) {
            if(materials[i+1].price != 0) {
                all[i] = materials[i+1];
            }
        }
        return all;
    }
    
    function getMaterial(uint _id) view public returns(Material memory) { 
        require(_id >0 && _id <= materialCount, "Invalid Id ");
        if(_id == materials[_id].id ) {
            return materials[_id];
        }
    }
    
    function updateMaterial(uint _id,string memory _name, address _owner, uint  _price) public returns(Material memory) {
        require(_id <= materialCount, "Invalid Id");
        if(_id == materials[_id].id) {
            materials[_id] = Material(_id, _name, _owner, _price);
            return materials[_id];
        }
    }
    
    function removeMaterial(uint  _id) public returns(string memory) {
        require(_id >0 , "Invalid id");
        
        // check if material are available
        if(_id == materials[_id].id) {
            delete materials[_id];
            return "Material deleted!";
        } else {
            return "Material Not Found";
        }
    }
    
    // Operation for contractor
    
    struct Bid {
        uint256 bidId;
        string name_of_contractor;
        address contractor;
        uint256 bidAmount;
        uint256 createdAt;
        uint256 contract_id;
    }
    
    event AddBid(
        address contractor,
        uint contractId,
        uint bidAmount,
        uint256 createdAt
    );
    mapping(uint256 => Bid) public bids;
    uint bidCount=0;
    
    function bidContract(address _contractor, uint  _contractId, uint _bidAmount, string memory _name_of_contractor) public returns(string memory) {
        require(_contractor != address(0), "Address should not be null");
        require(_contractId > 0, "Id should not be null");
        require(_bidAmount > 0, "Amount should not be null or 0");
        // // Checking account exits or not
        // for(uint i=0; i<= userCount; i++) {
        //     if(_contractor == accounts[i].addr) {
        //         _accountId = i;
        //     } 
        // }
        
            // Adding bid to bids mapping if criteria satisfy
        if(_contractId == schemes[_contractId].id && schemes[_contractId].isAlloted == false &&  _bidAmount <= schemes[_contractId].cost) {
            bidCount++;
            bids[bidCount] = Bid(bidCount, _name_of_contractor, _contractor, _bidAmount, block.timestamp, _contractId);
            emit AddBid(_contractor, _contractId, _bidAmount, block.timestamp);
            return "Bid added successful";
        } else {
            return "Error: Cannot add bid";
        }
        
    }
    
    function allocateContract(uint _id, address _contractor, uint256 _bidId ) public returns (bool) {
        require(_id >0, 'Invalid id');
        require(address(_contractor) != address(0), "Invalid address");
        if(_id == schemes[_id].id && schemes[_id].isAlloted == false && bids[_bidId].bidId == _bidId) {
            Scheme storage scheme = schemes[_id];
            scheme.isAlloted = true;
            scheme.contractor = _contractor;
            return true;
        }
        return false;

    }
    
    function getAllBids() view public returns(Bid[] memory) {
        Bid[] memory allBids = new Bid[](bidCount);
        for(uint i=0; i< bidCount; i++) {
            allBids[i] = bids[i+1];
        }
        return allBids;
    }
    
    function getABid(uint256 _contractId) view public  returns (Bid memory) {
        require(_contractId != 0, "Id should not be null");
        if(_contractId == schemes[_contractId].id ) {
            return bids[_contractId];
        }
    }
}