export async function getSolanaAccountInfo(account: string) {
  const response = await fetch("https://api.testnet.solana.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAccountInfo",
      params: [account],
    }),
  });

  const data = await response.json();
  return data;
}

export async function getSolanaBalance(account: string) {
  const response = await fetch("https://api.testnet.solana.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [account],
    }),
  });

  const data = await response.json();
  return data;
}

// //SEND
// import {
//   Connection,
//   PublicKey,
//   Keypair,
//   Transaction,
//   SystemProgram,
//   sendAndConfirmTransaction,
// } from "@solana/web3.js";

// async function sendSol(
//   fromKeypair: Keypair,
//   toAddress: string,
//   amount: number
// ) {
//   const connection = new Connection(
//     "https://api.mainnet-beta.solana.com",
//     "confirmed"
//   );
//   const toPublicKey = new PublicKey(toAddress);

//   const transaction = new Transaction().add(
//     SystemProgram.transfer({
//       fromPubkey: fromKeypair.publicKey,
//       toPubkey: toPublicKey,
//       lamports: amount, // 1 SOL = 1,000,000,000 lamports
//     })
//   );

//   const signature = await sendAndConfirmTransaction(connection, transaction, [
//     fromKeypair,
//   ]);

//   console.log("Transaction Signature:", signature);
// }

// // Usage example
// const fromKeypair = Keypair.fromSecretKey(
//   Uint8Array.from([
//     /* Your Secret Key Array */
//   ])
// );
// const toAddress = "RecipientPublicKey";
// const amount = 1000000000; // 1 SOL in lamports

// sendSol(fromKeypair, toAddress, amount);
