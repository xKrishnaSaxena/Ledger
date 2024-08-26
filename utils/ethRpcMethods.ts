async function getEthereumBalance(address: string) {
  const response = await fetch(
    "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
    }
  );

  const data = await response.json();
  return data;
}

async function getEthereumBlockNumber() {
  const response = await fetch(
    "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_blockNumber",
      }),
    }
  );

  const data = await response.json();
  return data;
}

// Usage example
const balance = async () => {
  await getEthereumBalance("0xaeaa570b50ad00377ff8add27c50a7667c8f1811");
};
console.log("ETH Balance:", balance);

const blockNumber = async () => {
  await getEthereumBlockNumber();
};
console.log("Latest Block Number:", blockNumber);

//SEND
import { ethers } from "ethers";

async function sendEth(
  fromPrivateKey: string,
  toAddress: string,
  amountInEther: string
) {
  const provider = new ethers.providers.InfuraProvider(
    "mainnet",
    "YOUR_INFURA_PROJECT_ID"
  );
  const wallet = new ethers.Wallet(fromPrivateKey, provider);

  const tx = {
    to: toAddress,
    value: ethers.utils.parseEther(amountInEther),
  };

  const transactionResponse = await wallet.sendTransaction(tx);
  console.log("Transaction Hash:", transactionResponse.hash);

  const receipt = await transactionResponse.wait();
  console.log("Transaction was mined in block:", receipt.blockNumber);
}

// Usage example
const fromPrivateKey = "0xYourPrivateKey"; // Sender's private key
const toAddress = "0xRecipientPublicKey";
const amountInEther = "0.1"; // Amount in ETH

sendEth(fromPrivateKey, toAddress, amountInEther);
