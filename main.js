"use strict";

//let anchorURL = '';

let cfg = {
    "web3Socket": {
        "protocol": "ws",
        "domain": "blockchain20.kmi.open.ac.uk",
        "port": "",
        "path": "/web3/"
    },
    abi: [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "hashIn",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "newIndexType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "lsds",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "div",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "quadHashFunctionIn",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "treeHashFunctionIn",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "indexHashFunctionIn",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "creationTime",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "divisor",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getData",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "theCreationTime",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "theOwner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "thetargetHash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "theIndexType",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "leastSignificants",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "theDivisor",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "theQuadHashFunction",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "theTreeHashFunction",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "theIndexHashFunction",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "indexHashFunction",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "indexType",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "leastSignificantDigits",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "quadHashFunction",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "targetHash",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "treeHashFunction",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ],
    publishURL: "https://blockchain21.kmi.open.ac.uk/linkchain/publish",
    anchorURL: "https://blockchain21.kmi.open.ac.uk/anchoring/anchorData",
    options: {
        "quadHash": "KECCAK-256",
        "treeHash": "KECCAK-256",
        "indexHash": "KECCAK-256",
        "lsd": 2,
        "indexType": "object",
        "divisor": "0xa"
    },
    authorisation : {
        secret : "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA2XJsdU1uQJOAfqWSDMHR\nKiYgKXB6wUPIoHCdS+GZDP4H1Jipw4KenZN2fJuc7Hw4BkAwG5t6ELGibIWXMvwX\nnwun9/kNxuMwcTpKCwsb/JC4fOvQdjDq0rPnmx/e7RF49IhWDOcQOF/SyPg1nWBT\n4rPE3nREY9sm/MjWEZrYl0f1s9sIYYnRLpnqwqISib8raRx2J6fh9P9z3weEOYT/\nMHdcuKblgoNB33Nya/d9un6laDOIi0F1TXZtx1MrCoJHNMOl+0+uFEVhdJuFehyv\nXvBYQ92hf9Gh1XOKrcGF7HEf4H9MKILr0RGUh6PKo3qNOW9YCfj0ZQ0Frq91ZeLL\nuRuNFoILRRIAajleuzShdDY1wfpXqsPZ6sGpFeOdXVvkIVYXGlz9yrOmMEIGsqPJ\nDP5mIY/4SlP0mksbkWxFESGUGUMMqT+LWG3ojHdBoH1upeNSwAKJKMCs58wLLvdn\n+/Ghl5/tSoO2fZvd5fPOsKB7X8+vSbjja60j6RqgwADXPxEWjiXGGwmr1fonPcUx\n3dsaF4JCplu9Rlr1lA5YyKTd+LsM0IgWn6W3vWLmjBQAIPz+8di8akGrWDxhljoW\nvz87E3c0KKDpDM242yezbnGx9OW6q739UoqP6OzN2zR+JSEXoPxf6Jh/CtYBX1mX\nTPCNXrW6QyXnSUDADbZi8NkCAwEAAQ==\n-----END PUBLIC KEY-----\n"
    },
    matomo : {
        trackerUrl: "http://knowledgebizvpn.ddns.net/matomo/matomo.php",
        siteId: 1,
        url:"https://blockchain21.kmi.open.ac.uk/badging/issueSmartBadge"
    }

};

let detailsOne = {
    "title": "Master of Science",
    "description": "A postgraduate course offered by the OU",
    "issuer": {
        "issuername": "The Open University",
        "issuerurl": "http://open.ac.uk/",
        "issueremail": "contact@open.ac.uk",
        "issuertelephone": "0300 303 5303",
        "issuerdescription": "The Open University was established by Royal Charter on 23 April 1969 and celebrated its 50th birthday in 2019.",
        "issuerimageurl": "NA"
    },
    "skills": "NQF level 7 course",
    "version": "1.0",
    "imageurl": "URL to point to the badge image"
};

let detailsTwo = {
    "badge":
        {
            "@context": [
                "https://w3id.org/openbadges/v2",
                {
                    "@vocab": "https://blockchain.open.ac.uk/vocab/"
                }
            ],
            "type": "BadgeClass",
            "name": "Master of Science",
            "description": "A postgraduate course offered by the OU",
            "image": "URL to point to the badge image",
            "version": "1.0",
            "criteria": {
                "type": "Criteria",
                "narrative": "Narrative 1",
                "skills": "skills 1"
            },
            "issuer": {
                "type": "Issuer",
                "name": "The Open University",
                "description": "The Open University was established by Royal Charter on 23 April 1969 and celebrated its 50th birthday in 2019.",
                "url": "http://open.ac.uk/",
                "image": "NA",
                "email": "student1@tecnico.ulisboa.pt",
                "telephone": "0300 303 5303"
            }
        },
    "recipient":
        {
            "name": "Dan Brown",
            "email": "dan.brown@outlook.com"
        }
};

let detailsThree = {
    "@context": [
        "https://w3id.org/openbadges/v2",
        {
            "@vocab": "https://blockchain.open.ac.uk/vocab/"
        }
    ],
    "type": "Assertion",
    "recipient": {
        "type": "email",
        "hashed": true,
        "salt": "deadsea",
        "name": "Dan Brown",
        "email": "dan.brown@outlook.com",
        "identity": "sha256$584ea33cdc8032a02642bae032c578dd97471b537bb82059f943b1a74c4b45da"
    },
    "badge": {
        "type": "BadgeClass",
        "name": "Master of Science",
        "description": "A postgraduate course offered by the OU",
        "image": "URL to point to the badge image",
        "version": "1.0",
        "criteria": {
            "type": "Criteria",
            "narrative": "The holder of this badge has achieved great things in QualiChain",
            "skills": "skills"
        },
        "issuer": {
            "type": "Issuer",
            "name": "The Open University",
            "description": "The Open University was established by Royal Charter on 23 April 1969 and celebrated its 50th birthday in 2019.",
            "url": "http://open.ac.uk/",
            "image": "NA",
            "email": "contact@open.ac.uk",
            "telephone": "0300 303 5303"
        }
    },
    "issuedOn": 1618233681547,
    "verification": {
        "type": "MerQLVerification2020"
    },
    "signature": {
        "type": "ETHMerQL",
        "address": "0x23aF61eDB24e70360d22DcA8C299a9B751a004C4",
        "account": "0x1cf67BCCD5377aF1a69BadA19D699BCBa805E3f6",
        "indexhash": "c5a6e87084da9dee6ed83962348e93a490de320d3b35187ef9358fd8665f274d",
        "settings": {
            "quadHash": "KECCAK-256",
            "treeHash": "KECCAK-256",
            "indexHash": "KECCAK-256",
            "lsd": 2,
            "indexType": "object",
            "divisor": "0xa"
        },
        "transactionhash": "0x1bf49f899da4b35eafc822127e8680fe55143d27a10e032ea5b196b7e51fc746"
    }
};


let linkchains_badges = window.linkchains_badges;
let metadata = {};


const anchorData = async function (cfg, metadata) {
    var token = document.getElementById('token').value;
    var anchor = cfg.anchorURL;
    // response from publish - the metadata
    var anchorResponse = await axios.post(anchor, metadata,
        {
            headers: {
                'Authorization': token
            }
        });
    var anchoredMetadata = anchorResponse.data;
    return anchoredMetadata;
};

linkchains_badges.createSmartBadge(detailsOne).then((answerOne) => {
    document.getElementById('answerDataOne').innerHTML = "<pre>" + JSON.stringify(answerOne, null, "  ") + "</pre>";
    linkchains_badges.issueSmartBadge(cfg, detailsTwo, anchorData).then((answerTwo) => {
        document.getElementById('answerDataTwo').innerHTML = "<pre>" + JSON.stringify(answerTwo, null, "  ") + "</pre>";
        linkchains_badges.verifySmartBadge(cfg, detailsThree).then((answerThree) => {
            document.getElementById('answerDataThree').innerHTML = "<pre>" + JSON.stringify(answerThree, null, "  ") + "</pre>";
        });
    })
});