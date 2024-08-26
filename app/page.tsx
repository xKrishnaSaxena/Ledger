"use client";
import React, { useEffect, useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { keccak256 } from "js-sha3";
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import solRpcMethods from "./../utils/solRpcMethods";
export default function Home() {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [customMnemonic, setCustomMnemonic] = useState<string>("");
  const [usingCustomMnemonic, setUsingCustomMnemonic] =
    useState<boolean>(false);
  const [keySOLPairArray, setKeySOLPairArray] = useState<
    {
      privateKeyBase58: string;
      publicKeyBase58: string;
      isPublicVisible: boolean;
      isPrivateVisible: boolean;
    }[]
  >([]);
  const [keyETHPairArray, setKeyETHPairArray] = useState<
    {
      privateKeyBase58: string;
      publicKeyBase58: string;
      isPublicVisible: boolean;
      isPrivateVisible: boolean;
    }[]
  >([]);
  const darkButton1 = "#e0e1dd";
  const darkButton2 = "#778da9";
  const { getSolanaAccountInfo, getSolanaBalance } = solRpcMethods();
  console.log("Hello world!");
  useEffect(() => {
    if (!usingCustomMnemonic) {
      const mnemonicGenerated = generateMnemonic();
      setMnemonic(mnemonicGenerated);
    }
  }, [usingCustomMnemonic]);

  function genSOLKeyPair(seed: Buffer) {
    if (!mnemonic) return;
    const path = `m/44'/501'/${keySOLPairArray.length + 1}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const privateKeyBase58 = bs58.encode(secret);
    const publicKeyBase58 = Keypair.fromSecretKey(secret).publicKey.toBase58();

    setKeySOLPairArray([
      ...keySOLPairArray,
      {
        privateKeyBase58,
        publicKeyBase58,
        isPublicVisible: false,
        isPrivateVisible: false,
      },
    ]);
  }

  function genETHKeyPair(seed: Buffer) {
    if (!mnemonic) return;
    const path = `m/44'/60'/${keyETHPairArray.length + 1}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = nacl.sign.keyPair.fromSeed(derivedSeed).publicKey;
    const ethereumAddress = `0x${keccak256(publicKey).slice(-40)}`;
    const privateKeyBase58 = bs58.encode(secret);
    const publicKeyBase58 = ethereumAddress;

    setKeyETHPairArray([
      ...keyETHPairArray,
      {
        privateKeyBase58,
        publicKeyBase58,
        isPublicVisible: false,
        isPrivateVisible: false,
      },
    ]);
  }

  function deleteKeySOLPair(index: number) {
    setKeySOLPairArray(keySOLPairArray.filter((_, i) => i !== index));
  }
  function deleteKeyETHPair(index: number) {
    setKeyETHPairArray(keyETHPairArray.filter((_, i) => i !== index));
  }

  function deleteAllKeySOLPairs() {
    setKeySOLPairArray([]);
  }
  function deleteAllKeyETHPairs() {
    setKeyETHPairArray([]);
  }

  function toggleVisibilitySOL(index: number, type: "public" | "private") {
    setKeySOLPairArray(
      keySOLPairArray.map((keyPair, i) =>
        i === index
          ? {
              ...keyPair,
              ...(type === "public"
                ? { isPublicVisible: !keyPair.isPublicVisible }
                : { isPrivateVisible: !keyPair.isPrivateVisible }),
            }
          : keyPair
      )
    );
  }
  function toggleVisibilityETH(index: number, type: "public" | "private") {
    setKeyETHPairArray(
      keyETHPairArray.map((keyPair, i) =>
        i === index
          ? {
              ...keyPair,
              ...(type === "public"
                ? { isPublicVisible: !keyPair.isPublicVisible }
                : { isPrivateVisible: !keyPair.isPrivateVisible }),
            }
          : keyPair
      )
    );
  }

  function handleMnemonicChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomMnemonic(e.target.value);
  }

  function handleMnemonicSubmit() {
    if (customMnemonic.split(" ").length === 12) {
      setMnemonic(customMnemonic);
      setUsingCustomMnemonic(true);
    } else {
      alert("Please enter a valid 12-word mnemonic.");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }

  if (!mnemonic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
        <div className="dot-spinner">
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
        </div>
      </div>
    );
  }

  const seed = mnemonicToSeedSync(mnemonic);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-3xl text-decoration-line: underline mb-5">
        Ledger Wallet
      </h1>
      <div className="text-center mb-4 w-full max-w-lg">
        <div className="bg-gray-200 mb-5 dark:bg-gray-700 p-2 rounded-md">
          <p className="text-xl font-bold">Mnemonic :</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {mnemonic.split(" ").map((word, index) => (
              <div
                key={index}
                className="bg-gray-300 dark:bg-gray-600 p-2 rounded-md text-center text-sm md:text-base"
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => genSOLKeyPair(seed)}
          className="mt-4 w-full md:w-auto text-black py-2 px-4 mr-4 rounded-md hover:bg-blue-600"
          style={{ backgroundColor: darkButton1 }}
        >
          Generate Solana Wallet
        </button>
        <button
          onClick={() => genETHKeyPair(seed)}
          className="mt-4 w-full md:w-auto text-black py-2 px-4 rounded-md hover:bg-blue-600"
          style={{ backgroundColor: darkButton1 }}
        >
          Generate Ethereum Wallet
        </button>

        {keySOLPairArray.length < 2 ? null : (
          <button
            onClick={deleteAllKeySOLPairs}
            className="mt-4 w-full md:w-auto ml-0 md:ml-4 text-black py-2 px-4 rounded-md hover:bg-red-600"
            style={{ backgroundColor: darkButton2 }}
          >
            Delete All Solana Accounts
          </button>
        )}
        {keyETHPairArray.length < 2 ? null : (
          <button
            onClick={deleteAllKeyETHPairs}
            className="mt-4 w-full md:w-auto ml-0 md:ml-4 text-black py-2 px-4 rounded-md hover:bg-red-600"
            style={{ backgroundColor: darkButton2 }}
          >
            Delete All Ethereum Accounts
          </button>
        )}
        {!usingCustomMnemonic && (
          <div className="mt-4 flex flex-col md:flex-row items-center w-full max-w-lg">
            <input
              type="text"
              value={customMnemonic}
              onChange={handleMnemonicChange}
              placeholder="Enter your 12-word mnemonic"
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded-md w-full"
            />
            <button
              onClick={handleMnemonicSubmit}
              className="mt-2 md:mt-0 md:ml-2 w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Submit Mnemonic
            </button>
          </div>
        )}
      </div>

      {keySOLPairArray.length > 0 && (
        <div className="text-left w-full max-w-lg mt-4">
          <h2 className="text-2xl mb-2">Solana Wallets</h2>
          {keySOLPairArray.map((keyPair, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 p-3 mb-2 rounded-md"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold">Public Key:</p>
                <button
                  onClick={() => toggleVisibilitySOL(index, "public")}
                  className="ml-2"
                >
                  {keyPair.isPublicVisible ? (
                    <EyeIcon className="h-5 w-5 text-black" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
              <p className="break-all">
                {keyPair.isPublicVisible ? keyPair.publicKeyBase58 : "********"}
              </p>
              <button
                onClick={() => copyToClipboard(keyPair.publicKeyBase58)}
                className="ml-2"
              >
                <ClipboardIcon className="h-5 w-5 text-black" />
              </button>

              <div className="flex items-center justify-between mt-2">
                <p className="font-bold">Private Key:</p>
                <button
                  onClick={() => toggleVisibilitySOL(index, "private")}
                  className="ml-2"
                >
                  {keyPair.isPrivateVisible ? (
                    <EyeIcon className="h-5 w-5 text-black" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
              <p className="break-all">
                {keyPair.isPrivateVisible
                  ? keyPair.privateKeyBase58
                  : "********"}
              </p>
              <button
                onClick={() => copyToClipboard(keyPair.privateKeyBase58)}
                className="ml-2"
              >
                <ClipboardIcon className="h-5 w-5 text-black" />
              </button>

              <button
                onClick={() => deleteKeySOLPair(index)}
                className="ml-2 mt-2 bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700"
              >
                <TrashIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {keyETHPairArray.length > 0 && (
        <div className="text-left w-full max-w-lg mt-4">
          <h2 className="text-2xl mb-2">Ethereum Wallets</h2>
          {keyETHPairArray.map((keyPair, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 p-3 mb-2 rounded-md"
            >
              <div className="flex items-center justify-between">
                <p className="font-bold">Public Key:</p>
                <button
                  onClick={() => toggleVisibilityETH(index, "public")}
                  className="ml-2"
                >
                  {keyPair.isPublicVisible ? (
                    <EyeIcon className="h-5 w-5 text-black" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
              <p className="break-all">
                {keyPair.isPublicVisible ? keyPair.publicKeyBase58 : "********"}
              </p>
              <button
                onClick={() => copyToClipboard(keyPair.publicKeyBase58)}
                className="ml-2"
              >
                <ClipboardIcon className="h-5 w-5 text-black" />
              </button>

              <div className="flex items-center justify-between mt-2">
                <p className="font-bold">Private Key:</p>
                <button
                  onClick={() => toggleVisibilityETH(index, "private")}
                  className="ml-2"
                >
                  {keyPair.isPrivateVisible ? (
                    <EyeIcon className="h-5 w-5 text-black" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 text-black" />
                  )}
                </button>
              </div>
              <p className="break-all">
                {keyPair.isPrivateVisible
                  ? keyPair.privateKeyBase58
                  : "********"}
              </p>
              <button
                onClick={() => copyToClipboard(keyPair.privateKeyBase58)}
                className="ml-2"
              >
                <ClipboardIcon className="h-5 w-5 text-black" />
              </button>

              <button
                onClick={() => deleteKeyETHPair(index)}
                className="ml-2 mt-2 bg-red-600 text-white py-1 px-2 rounded-md hover:bg-red-700"
              >
                <TrashIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
