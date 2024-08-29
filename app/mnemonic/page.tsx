"use client";

import React, { useEffect, useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { ethers, keccak256 } from "ethers";
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Spinner from "../components/Spinner";

export default function Page() {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [customMnemonic, setCustomMnemonic] = useState<string>("");
  const [usingCustomMnemonic, setUsingCustomMnemonic] =
    useState<boolean>(false);
  const [keySOLPairArray, setKeySOLPairArray] = useState<any[]>([]);
  const [keyETHPairArray, setKeyETHPairArray] = useState<any[]>([]);
  const [isMnemonicVisible, setIsMnemonicVisible] = useState<boolean>(false);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const handleMnemonicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMnemonic(e.target.value);
  };

  const handleMnemonicSubmit = () => {
    if (customMnemonic.split(" ").length === 12) {
      setMnemonic(customMnemonic);
      setUsingCustomMnemonic(true);
    } else {
      alert("Please enter a valid 12-word mnemonic.");
    }
  };

  const generateSolanaWallet = async (seed: Buffer) => {
    const path = `m/44'/501'/${keySOLPairArray.length + 1}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    const publicKeyBase58 = keypair.publicKey.toBase58();
    const privateKeyBase58 = bs58.encode(keypair.secretKey);

    setKeySOLPairArray((prevArray) => {
      const newArray = [
        ...prevArray,
        {
          privateKeyBase58,
          publicKeyBase58,
          isPublicVisible: false,
          isPrivateVisible: false,
        },
      ];
      localStorage.setItem("keySOLPairArray", JSON.stringify(newArray));
      return newArray;
    });
  };

  const generateEthereumWallet = async (seed: Buffer) => {
    if (!mnemonic) return;
    const path = `m/44'/60'/${keyETHPairArray.length + 1}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
    const ethereumAddress = `0x${keccak256(keypair.publicKey).slice(-40)}`;
    const privateKeyBase58 = bs58.encode(keypair.secretKey);

    setKeyETHPairArray((prevArray) => {
      const newArray = [
        ...prevArray,
        {
          privateKeyBase58,
          publicKeyBase58: ethereumAddress,
          isPublicVisible: false,
          isPrivateVisible: false,
        },
      ];
      localStorage.setItem("keyETHPairArray", JSON.stringify(newArray));
      return newArray;
    });
  };
  const toggleVisibility = (index: number, isSOL: boolean, type: string) => {
    if (isSOL) {
      const updatedSOL = [...keySOLPairArray];
      updatedSOL[index] = {
        ...updatedSOL[index],
        [`is${type.charAt(0).toUpperCase() + type.slice(1)}Visible`]:
          !updatedSOL[index][
            `is${type.charAt(0).toUpperCase() + type.slice(1)}Visible`
          ],
      };
      setKeySOLPairArray(updatedSOL);
    } else {
      const updatedETH = [...keyETHPairArray];
      updatedETH[index] = {
        ...updatedETH[index],
        [`is${type.charAt(0).toUpperCase() + type.slice(1)}Visible`]:
          !updatedETH[index][
            `is${type.charAt(0).toUpperCase() + type.slice(1)}Visible`
          ],
      };
      setKeyETHPairArray(updatedETH);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const deleteKeySOLPair = (index: number) => {
    setKeySOLPairArray(keySOLPairArray.filter((_, i) => i !== index));
  };

  const deleteKeyETHPair = (index: number) => {
    setKeyETHPairArray(keyETHPairArray.filter((_, i) => i !== index));
  };

  const deleteAllKeySOLPairs = () => {
    setKeySOLPairArray([]);
  };

  const deleteAllKeyETHPairs = () => {
    setKeyETHPairArray([]);
  };
  const generateNewSeed = () => {
    const mnemonicGenerated = generateMnemonic();
    setMnemonic(mnemonicGenerated);
    setKeyETHPairArray([]);
    setKeySOLPairArray([]);
    localStorage.setItem("keyETHPairArray", JSON.stringify([]));
    localStorage.setItem("keySOLPairArray", JSON.stringify([]));
  };
  useEffect(() => {
    const storedMnemonic = localStorage.getItem("mnemonic");
    const storedSOLPairs = localStorage.getItem("keySOLPairArray");
    const storedETHPairs = localStorage.getItem("keyETHPairArray");
    if (storedMnemonic) {
      setMnemonic(storedMnemonic);
    } else {
      const mnemonicGenerated = generateMnemonic();
      setMnemonic(mnemonicGenerated);
    }
    if (storedSOLPairs) {
      setKeySOLPairArray(JSON.parse(storedSOLPairs));
    }
    if (storedETHPairs) {
      setKeyETHPairArray(JSON.parse(storedETHPairs));
    }
  }, []);

  if (!mnemonic) return <Spinner />;

  const seed = mnemonicToSeedSync(mnemonic);

  return (
    <div className="flex items-center justify-center h-screen text-gray-100 p-8">
      <div className="flex w-full max-w-7xl h-full overflow-hidden">
        <div className="flex-none w-1/2 p-12 bg-darkGray rounded-lg shadow-lg">
          <p className="text-4xl font-bold text-white mb-8 flex justify-center">
            Mnemonic
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {mnemonic.split(" ").map((word, index) => (
              <div
                key={index}
                className="bg-lightGray p-6 rounded-md text-center text-xl md:text-2xl text-white"
              >
                {isMnemonicVisible ? word : "****"}
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsMnemonicVisible(!isMnemonicVisible)}
            className="bg-blue-500 text-white py-3 px-6 rounded-md text-lg"
          >
            {isMnemonicVisible ? "Hide Seed Phrase" : "Show Seed Phrase"}
          </button>
          <button
            onClick={() => generateNewSeed()}
            className="bg-blue-500 text-white py-3 ml-5 px-6 rounded-md text-lg"
          >
            Generate New Seed Phrase
          </button>

          {!usingCustomMnemonic && (
            <div className="mt-8 flex flex-col md:flex-row items-center w-full">
              <input
                type="text"
                value={customMnemonic}
                onChange={handleMnemonicChange}
                placeholder="Enter your 12-word mnemonic"
                className="bg-gray-700 text-gray-100 p-6 rounded-md w-full mb-4 md:mb-0 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg"
              />
              <button
                onClick={handleMnemonicSubmit}
                className="md:ml-4 w-full md:w-auto bg-gray-600 text-white py-3 px-8 rounded-md hover:bg-gray-500 transition duration-300 text-lg"
              >
                Submit Mnemonic
              </button>
            </div>
          )}
          <div className="mt-8">
            <button
              onClick={() => generateSolanaWallet(seed)}
              className="text-black py-3 px-6 mr-4 rounded-md hover:bg-blue-600 text-lg"
              style={{ backgroundColor: "#e0e1dd" }}
            >
              Generate Solana Wallet (Devnet)
            </button>

            <button
              onClick={() => generateEthereumWallet(seed)}
              className="text-black py-3 px-6 mt-5 rounded-md hover:bg-blue-600 text-lg"
              style={{ backgroundColor: "#e0e1dd" }}
            >
              Generate Ethereum Wallet (Goerli)
            </button>
          </div>
        </div>

        <div className="flex-grow w-1/2 p-12 overflow-y-auto">
          <div className="bg-darkGray p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-6">
              <p className="text-2xl font-semibold text-white">
                Solana Wallets
              </p>
              <button onClick={deleteAllKeySOLPairs} className="text-red-500">
                <TrashIcon className="h-8 w-8" />
              </button>
            </div>
            {keySOLPairArray.map((wallet, index) => (
              <div
                key={index}
                className="mb-6 p-6 bg-gray-700 rounded-md text-white overflow-hidden break-words"
              >
                <p className="text-lg">
                  Public Key:{" "}
                  {wallet.isPublicVisible ? wallet.publicKeyBase58 : "****"}
                  <button
                    onClick={() => toggleVisibility(index, true, "public")}
                    className="ml-4 text-sm text-blue-400 underline"
                  >
                    {wallet.isPublicVisible ? (
                      <EyeSlashIcon className="h-5 w-5 inline" />
                    ) : (
                      <EyeIcon className="h-5 w-5 inline" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(wallet.publicKeyBase58)}
                    className="ml-4 text-sm text-blue-400 underline"
                  >
                    <ClipboardIcon className="h-5 w-5 inline" />
                  </button>
                </p>
                <p className="text-lg mt-2">
                  Private Key:{" "}
                  {wallet.isPrivateVisible ? wallet.privateKeyBase58 : "****"}
                  <button
                    onClick={() => toggleVisibility(index, true, "private")}
                    className="ml-4 text-sm text-blue-400 underline"
                  >
                    {wallet.isPrivateVisible ? (
                      <EyeSlashIcon className="h-5 w-5 inline" />
                    ) : (
                      <EyeIcon className="h-5 w-5 inline" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(wallet.privateKeyBase58)}
                    className="ml-4 text-sm text-blue-400 underline"
                  >
                    <ClipboardIcon className="h-5 w-5 inline" />
                  </button>
                </p>
                <div className="flex mt-6 space-x-3">
                  <button className="bg-lightGray text-white py-2 px-4 rounded-md text-lg">
                    Send
                  </button>
                  <button className="bg-lightGray text-white py-2 px-4 rounded-md text-lg">
                    Receive
                  </button>
                  <button className="bg-lightGray text-white py-2 px-4 rounded-md text-lg">
                    Check Balance
                  </button>
                  <button
                    onClick={() => deleteKeySOLPair(index)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md text-lg"
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-darkGray p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <p className="text-2xl font-semibold text-white">
                Ethereum Wallets
              </p>
              <button onClick={deleteAllKeyETHPairs} className="text-red-500">
                <TrashIcon className="h-8 w-8" />
              </button>
            </div>
            {keyETHPairArray.map((wallet, index) => (
              <div
                key={index}
                className="mb-6 p-6 bg-gray-700 rounded-md text-white overflow-hidden break-words"
              >
                <p className="text-lg">
                  Public Key:{" "}
                  {wallet.isPublicVisible ? wallet.publicKeyBase58 : "****"}
                  <button
                    onClick={() => toggleVisibility(index, false, "public")}
                    className="ml-4 text-sm text-blue-400 underline"
                  >
                    {wallet.isPublicVisible ? (
                      <EyeSlashIcon className="h-5 w-5 inline" />
                    ) : (
                      <EyeIcon className="h-5 w-5 inline" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(wallet.publicKeyBase58)}
                    className="ml-4 text-sm text-blue-400 underline"
                  >
                    <ClipboardIcon className="h-5 w-5 inline" />
                  </button>
                </p>
                <p className="text-lg mt-2">
                  Private Key:{" "}
                  {wallet.isPrivateVisible ? wallet.privateKeyBase58 : "****"}
                  <button
                    onClick={() => toggleVisibility(index, false, "private")}
                    className="ml-4 text-sm text-blue-400 underline"
                  >
                    {wallet.isPrivateVisible ? (
                      <EyeSlashIcon className="h-5 w-5 inline" />
                    ) : (
                      <EyeIcon className="h-5 w-5 inline" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(wallet.privateKeyBase58)}
                    className="ml-4 text-sm text-blue-400 underline"
                  >
                    <ClipboardIcon className="h-5 w-5 inline" />
                  </button>
                </p>
                <div className="flex mt-6 space-x-3">
                  <button className="bg-lightGray text-white py-2 px-4 rounded-md text-lg">
                    Send
                  </button>
                  <button className="bg-lightGray text-white py-2 px-4 rounded-md text-lg">
                    Receive
                  </button>
                  <button className="bg-lightGray text-white py-2 px-4 rounded-md text-lg">
                    Check Balance
                  </button>
                  <button
                    onClick={() => deleteKeyETHPair(index)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md text-lg"
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
