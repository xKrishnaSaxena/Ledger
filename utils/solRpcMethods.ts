import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export async function getSolanaBalance(account: string): Promise<any> {
  const response = await fetch("https://api.devnet.solana.com", {
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
    "https://api.devnet.solana.com",
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
  getSolanaBalance,
  sendSolanaTransaction,
};
