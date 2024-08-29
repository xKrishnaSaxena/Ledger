import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function getSolanaAccountInfo(account: string): Promise<any> {
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

  return await response.json();
}

export async function getSolanaBalance(account: string): Promise<any> {
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

  return await response.json();
}

export async function sendSolanaTransaction(
  fromKeypair: Keypair,
  toAddress: string,
  amount: number
): Promise<string> {
  const connection = new Connection(
    "https://api.testnet.solana.com",
    "confirmed"
  );
  const toPublicKey = new PublicKey(toAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey,
      lamports: amount,
    })
  );

  return await sendAndConfirmTransaction(connection, transaction, [
    fromKeypair,
  ]);
}

export default {
  getSolanaAccountInfo,
  getSolanaBalance,
  sendSolanaTransaction,
};
