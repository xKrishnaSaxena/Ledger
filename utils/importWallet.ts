import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";

export async function importWalletFromKey(privateKey: string) {
  try {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    return {
      publicKeyBase58: keypair.publicKey.toBase58(),
      privateKeyBase58: privateKey,
    };
  } catch (error) {
    throw new Error("Invalid private key.");
  }
}

export async function importWalletFromMnemonic(mnemonic: string) {
  try {
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/0'/0'`; // Default path for Solana
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    return {
      publicKeyBase58: keypair.publicKey.toBase58(),
      privateKeyBase58: bs58.encode(keypair.secretKey),
    };
  } catch (error) {
    throw new Error("Invalid seed phrase.");
  }
}
