pragma solidity  ^0.6.0;
pragma experimental ABIEncoderV2;

contract userContract {
    
    // Schemes 
    struct Scheme {
        uint id;
        string name;
        string description;
        string date;
        address contractor;
        uint cost;
        uint256 createdAt;
        string image_path;
        bool isAlloted;
        string contractor_name;
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
  
    
    // Event for Schemes
    event Addscheme (
        uint id,
        string name,
        string description,
        string date,
        address owner,
        uint cost,
        uint256 createdAt
    );
    
    event DeleteScheme (
        uint id,
        string name,
        string description,
        string date,
        address owner,
        uint cost,
        uint256 createdAt
    );
    
 
    event UpdateScheme (
        uint id,
        string name,
        string description,
        string date,
        address owner,
        uint cost,
        uint256 createdAt
    );
    
    // Event for Materials
    event AddMaterial(
        string name,
        address owner,
        uint price
    );
    
    event DeleteMaterial (
        string name,
        address owner,
        uint price
    );
    
    event UpdateMaterial (
        string name,
        address owner,
        uint price
    );
    
    
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
    
    function addScheme(string memory _name, string memory _date, string memory _description, uint  _cost, string memory _image_path) public {
        require(bytes(_name).length > 0 , "Name should not be null");
        // require(_owner != address(0x0), "Address should not be null"); for initial 0x0 must be owner
        require(_cost > 0, "Invalid cost");
        schemeCount++;
        
        // Add scheme to Scheme structure with mapping schemes
        schemes[schemeCount] = Scheme(schemeCount, _name,_description, _date, address(0), _cost, block.timestamp ,_image_path ,false ,"NA");
        emit Addscheme(schemeCount, _name,_description, _date, address(0), _cost, block.timestamp);
    }
    
    function removeScheme(uint  _id) public returns(string memory) {
        // require(_id >0 && _id <= schemeCount,"Not valid id");
        
        // check if scheme are available
        if(schemes[_id].id == _id) {
            delete schemes[_id];
            emit DeleteScheme(_id, schemes[_id].name, schemes[_id].description, schemes[_id].date, schemes[_id].contractor, schemes[_id].cost, schemes[_id].createdAt);
            return "Scheme deleted!";
        } else {
            return "Scheme Not Found";
        }
    }
    
    function updateScheme(uint _id,string memory _name,string memory _description, string memory _date, uint  _cost,string memory _image_path) public returns(Scheme memory) {
        require(_id <= schemeCount, "Invalid scheme id");
        if(_id == schemes[_id].id) {
            schemes[_id] = Scheme(_id, _name, _description, _date, address(0), _cost, block.timestamp ,_image_path, false, "NA");
            emit UpdateScheme(_id, _name, _description, _date, address(0), _cost, block.timestamp );
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
            emit UpdateMaterial( _name, _owner, _price);
            return materials[_id];
        }
    }
    
    function removeMaterial(uint  _id) public returns(string memory) {
        require(_id >0 , "Invalid id");
        
        // check if material are available
        if(_id == materials[_id].id) {
            delete materials[_id];
            emit DeleteMaterial(materials[_id].name, materials[_id].owner, materials[_id].price);
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
        bool isApproved;
    }
    
    event AddBid(
        string contractor_name,
        address contractor,
        uint contractId,
        uint bidAmount,
        uint256 createdAt
    );
    
    event AllocateContract (
        uint256 contract_id,
        string contractor_name,
        uint256 bid_id
    );
    
    event DeleteBid (
        string name_of_contractor,
        uint256 bidAmount,
        uint256 createdAt
    );
    
    mapping(uint256 => Bid) public bids;
    uint public bidCount=0;
    
    function bidContract(address _contractor, uint  _contractId, uint _bidAmount, string memory _name_of_contractor) public returns(string memory) {
        require(_contractor != address(0), "Address should not be null");
        require(_contractId > 0, "Id should not be null");
        require(_bidAmount > 0, "Amount should not be null or 0");
        
        
        // Adding bid to bids mapping if criteria satisfy
        if(_contractId == schemes[_contractId].id && schemes[_contractId].isAlloted == false &&  _bidAmount <= schemes[_contractId].cost) {
            bidCount++;
            bids[bidCount] = Bid(bidCount, _name_of_contractor, _contractor, _bidAmount, block.timestamp, _contractId, false);
            emit AddBid(_name_of_contractor,_contractor, _contractId, _bidAmount, block.timestamp);
            return "Bid added successful";
        } else {
            return "Error: Cannot add bid";
        }
        
    }
    
    function allocateContract(uint _id, address _contractor, uint256 _bidId, string memory _contractor_name ) public returns (bool) {
        require(_id >0, 'Invalid id');
        require(address(_contractor) != address(0), "Invalid address");
        if(_id == schemes[_id].id && schemes[_id].isAlloted == false && bids[_bidId].bidId == _bidId) {
            Scheme storage scheme = schemes[_id];
            scheme.isAlloted = true;
            scheme.contractor = _contractor;
            scheme.contractor_name = _contractor_name;
            
            Bid storage bid = bids[_bidId];
            bid.isApproved = true;
            emit AllocateContract(_id, _contractor_name, _bidId);
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
    function deleteBid(uint256 _bidId) public returns (bool) {
        require(_bidId > 0, "Invalid Id");
        if(_bidId == bids[_bidId].bidId) {
            delete bids[_bidId];
            emit DeleteBid(bids[_bidId].name_of_contractor, bids[_bidId].bidAmount, bids[_bidId].createdAt);
            return true;
        }
        return false;
    }
    
    struct Funds {
        uint256 fund_id;
        uint256 amount;
        uint contract_id;
        string contractor;
        bool isAllocated;
    }
    
    event AddFunds (
        uint256 Amount,
        string NameofContractor,
        uint256 ContractID,
        uint256 BidID
        );
    
    mapping(uint256 => Funds) public funds;
    uint256 public fundCount=0;
    
    function giveFund(uint256 _amount, string memory _contractor, uint256 _contract_id, uint _bid_id ) public returns(bool) {
        require(_amount > 0, "Invalid amount");
        require(bytes(_contractor).length > 0, "Invalid contractor name");
        require(_contract_id > 0, "Invalid contract id");
        // Checking the scheme is exist or not and allocated .
        if(_contract_id == schemes[_contract_id].id && schemes[_contract_id].isAlloted == true ) {
            // checking if bid is valid or not
            if(bids[_bid_id].bidId == _bid_id && bids[_bid_id].isApproved == true && _amount <= bids[_bid_id].bidAmount ) {
                fundCount  ++;
                funds[fundCount] = Funds(fundCount, _amount, _contract_id, _contractor, true);
                emit AddFunds(_amount, _contractor, _contract_id, _bid_id);
                return true;
            }
            return false;
        }
        return false;
    }
    
}