//D:\PROJECTS\EVIDENCE\evidence-vault02\evidence-vault\backend\blockchainConnect.js

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../.env") });


const blockchainInsert = async (id, caseNo, caseName, fileName, fileType, fileHash, _status_) => {
    const Web3 = require("web3");

    // setup a http provider
    let web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));


    const filePath = path.join(__dirname, '../blockchain/build/contracts/EPB.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = await JSON.parse(data);

    var contractAddress = process.env.CONTRACT_ADDRESS;
    let abi = (jsonData.abi);

    // Creating an instance of the contract
    const contract = new web3.eth.Contract(abi, contractAddress);

    //calling insert evidence method
    await contract.methods.insertEvidence(id, caseNo, caseName, fileName, fileType, fileHash, _status_).send({ from: process.env.FROM_ADDR, gas: 3000000 })
        .then((receipt) => {
            console.log("Evidence data uploaded on blockchain");
        })
        .catch((error) => {
            console.error(error);
        });
}


const getEvidencesLink = async (_caseNo_, _fileNames_) => {
    const Web3 = require("web3");

    if (!Array.isArray(_fileNames_)) {
        _fileNames_ = [_fileNames_];
    }

    let web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));

    const filePath = path.join(__dirname, '../blockchain/build/contracts/EPB.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    const contract = new web3.eth.Contract(jsonData.abi, process.env.CONTRACT_ADDRESS);

    try {
        const evidenceList = await contract.methods.viewEvidence(_caseNo_).call({ from: process.env.FROM_ADDR });

        console.log("✅ Raw blockchain data:", evidenceList); // <-- Debug print

        const structured = evidenceList.map(e => ({
            id: e.id,
            case_no: e.case_no,
            case_name: e.case_name,
            file_name: e.file_name,
            file_type: e.file_type,
            file_hash_ipfs: e.file_hash_ipfs,
            status: e.status,
        }));

        const result = {};

        _fileNames_.forEach((fileName) => {
            const evidence = structured.find(e => e.file_name === fileName);
            if (evidence) {
                result[fileName] = {
                    file_hash_ipfs: `https://gateway.pinata.cloud/ipfs/${evidence.file_hash_ipfs}`,
                    id: evidence.id,
                };

            }
        });

        console.log("DEBUG:", evidenceList);


        return result;
    } catch (error) {
        console.log("⛔ Blockchain getEvidencesLink Error:", error.message);
        return false;
    }
};




const insertLog = async (id, caseNo, caseName, fileName, fileType, _status_) => {
    const Web3 = require("web3");

    // setup a http provider
    let web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));


    const filePath = path.join(__dirname, '../blockchain/build/contracts/EPB.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = await JSON.parse(data);

    var contractAddress = process.env.CONTRACT_ADDRESS;
    let abi = (jsonData.abi);

    // Creating an instance of the contract
    const contract = new web3.eth.Contract(abi, contractAddress);

    //calling insert evidence method
    await contract.methods.insertNewEvidence(id, caseNo, caseName, fileName, fileType, _status_).send({ from: process.env.FROM_ADDR, gas: 3000000 })
        .then((receipt) => {
            console.log("Log uploaded on blockchain");
        })
        .catch((error) => {
            console.error(error);
        });
}

const chainOfCustody = async (caseNo) => {
    const Web3 = require("web3");

    // setup a http provider
    let web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));


    const filePath = path.join(__dirname, '../blockchain/build/contracts/EPB.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = await JSON.parse(data);

    var contractAddress = process.env.CONTRACT_ADDRESS;
    let abi = (jsonData.abi);

    // Creating an instance of the contract
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        const result = await contract.methods.viewEvidenceByCaseNo(caseNo).call();
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}
module.exports = {
    blockchainInsert,
    getEvidencesLink,
    insertLog,
    chainOfCustody
};




