const Web3 = require('web3')

let web3;
contractAddress = '0x3b97c41f470f20d6e00dc2da7823e5dc37d6ed98'
// Ropsten address - 0x3b97c41f470f20d6e00dc2da7823e5dc37d6ed98
ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "ContractorName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "ContractorAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ContractID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "BidAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "CreatedAt",
				"type": "uint256"
			}
		],
		"name": "AddBid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "Amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "NameofContractor",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ContractID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "BidID",
				"type": "uint256"
			}
		],
		"name": "AddFunds",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "addMaterial",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "MaterialName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "MaterialOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "MaterialPrice",
				"type": "uint256"
			}
		],
		"name": "AddMaterial",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_date",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_cost",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_image_path",
				"type": "string"
			}
		],
		"name": "addScheme",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "SchemeID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "SchemeName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "Description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "Date",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "ContractorAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "EstimateCost",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "CreatedAt",
				"type": "uint256"
			}
		],
		"name": "Addscheme",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_contractor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_bidId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_contractor_name",
				"type": "string"
			}
		],
		"name": "allocateContract",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ContractID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ContractorName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "BidID",
				"type": "uint256"
			}
		],
		"name": "AllocateContract",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_contractor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_contractId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_bidAmount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name_of_contractor",
				"type": "string"
			}
		],
		"name": "bidContract",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_bidId",
				"type": "uint256"
			}
		],
		"name": "deleteBid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "ContractorName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "BidAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "CreatedAt",
				"type": "uint256"
			}
		],
		"name": "DeleteBid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "MaterialName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "MaterialOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "MaterialPrice",
				"type": "uint256"
			}
		],
		"name": "DeleteMaterial",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "SchemeID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "SchemeName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "Description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "Date",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "ContractorAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "EstimateCost",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "CreatedAt",
				"type": "uint256"
			}
		],
		"name": "DeleteScheme",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_contractor",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_contract_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_bid_id",
				"type": "uint256"
			}
		],
		"name": "giveFund",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "removeMaterial",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "removeScheme",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "updateMaterial",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"internalType": "struct userContract.Material",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "MaterialName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "MaterialOwner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "MaterialPrice",
				"type": "uint256"
			}
		],
		"name": "UpdateMaterial",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_date",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_cost",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_image_path",
				"type": "string"
			}
		],
		"name": "updateScheme",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "date",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "contractor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "image_path",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isAlloted",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "contractor_name",
						"type": "string"
					}
				],
				"internalType": "struct userContract.Scheme",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "SchemeID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "SchemeName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "Description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "Date",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "ContractorAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "EstimateCost",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "CreatedAt",
				"type": "uint256"
			}
		],
		"name": "UpdateScheme",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "allMaterials",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"internalType": "struct userContract.Material[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "allSchemes",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "date",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "contractor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "image_path",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isAlloted",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "contractor_name",
						"type": "string"
					}
				],
				"internalType": "struct userContract.Scheme[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "bidCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "bidId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name_of_contractor",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "contractor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "bidAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "contract_id",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isApproved",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "funds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "fund_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "contract_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "contractor",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isAllocated",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_contractId",
				"type": "uint256"
			}
		],
		"name": "getABid",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "bidId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name_of_contractor",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "contractor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "bidAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "contract_id",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isApproved",
						"type": "bool"
					}
				],
				"internalType": "struct userContract.Bid",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllBids",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "bidId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name_of_contractor",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "contractor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "bidAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "contract_id",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isApproved",
						"type": "bool"
					}
				],
				"internalType": "struct userContract.Bid[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getMaterial",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					}
				],
				"internalType": "struct userContract.Material",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getScheme",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "date",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "contractor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "cost",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "image_path",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isAlloted",
						"type": "bool"
					},
					{
						"internalType": "string",
						"name": "contractor_name",
						"type": "string"
					}
				],
				"internalType": "struct userContract.Scheme",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "materialCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "materials",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "schemeCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "schemes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "date",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "contractor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "cost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "image_path",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isAlloted",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "contractor_name",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
module.exports = {
    initWeb3: (req, res, next)=> {
        global.web3 = new Web3()
        global.web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8545'));  
        return  global.web3.eth.net.isListening()
    },
    initContract() {
        const crs = new global.web3.eth.Contract(ABI, contractAddress) 
        return crs  
    }
}