"use client";
import React, { useEffect, useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { keccak256 } from "js-sha3";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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

  useEffect(() => {
    if (!usingCustomMnemonic) {
      // Generate mnemonic and seed only on the client-side
      const mnemonicGenerated = generateMnemonic();
      setMnemonic(mnemonicGenerated);
    }
  }, [usingCustomMnemonic]);

  function genSOLKeyPair(seed: Buffer) {
    if (!mnemonic) return; // Ensure mnemonic is available
    const path = `m/44'/501'/${keySOLPairArray.length + 1}'/0'`; // Derivation path
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
    if (!mnemonic) return; // Ensure mnemonic is available
    const path = `m/44'/60'/${keyETHPairArray.length + 1}'/0'`; // Derivation path
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
      <div className="text-center mb-4">
        <div className="bg-gray-200 mb-5 dark:bg-gray-700 p-2 rounded-md">
          <p className="text-xl font-bold">Mnemonic :</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {mnemonic.split(" ").map((word, index) => (
              <div
                key={index}
                className="bg-gray-300 dark:bg-gray-600 p-2 rounded-md text-center"
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => genSOLKeyPair(seed)}
          className="mt-4 text-black py-2 px-4 mr-4 rounded-md hover:bg-blue-600"
          style={{ backgroundColor: darkButton1 }}
        >
          Generate Solana Wallet
        </button>
        <button
          onClick={() => genETHKeyPair(seed)}
          className="mt-4 text-black py-2 px-4 rounded-md hover:bg-blue-600"
          style={{ backgroundColor: darkButton1 }}
        >
          Generate Ethereum Wallet
        </button>

        {keySOLPairArray.length < 2 ? null : (
          <button
            onClick={deleteAllKeySOLPairs}
            className="ml-4 text-black py-2 px-4 rounded-md hover:bg-red-600"
            style={{ backgroundColor: darkButton2 }}
          >
            Delete All Solana KeyPairs
          </button>
        )}
        {keyETHPairArray.length < 2 ? null : (
          <button
            onClick={deleteAllKeyETHPairs}
            className="ml-4 text-black py-2 px-4 rounded-md hover:bg-red-600"
            style={{ backgroundColor: darkButton2 }}
          >
            Delete All Ethereum KeyPairs
          </button>
        )}
        {!usingCustomMnemonic && (
          <div className="mt-4">
            <input
              type="text"
              value={customMnemonic}
              onChange={handleMnemonicChange}
              placeholder="Enter your 12-word mnemonic"
              className="p-2 border rounded-md text-black"
            />
            <button
              onClick={handleMnemonicSubmit}
              className="ml-2 py-2 px-4 rounded-md hover:bg-green-600 text-black"
              style={{ backgroundColor: darkButton1 }}
            >
              Use Custom Mnemonic
            </button>
          </div>
        )}
      </div>
      {keySOLPairArray.length > 0 ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-2 text-center">
            Generated Solana Key Pairs
          </h2>
          <ul className="space-y-4">
            {keySOLPairArray.map((keyPair, index) => (
              <li
                key={index}
                className="flex flex-col items-start space-y-4 bg-gray-200 dark:bg-gray-700 p-4 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleVisibilitySOL(index, "public")}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    {keyPair.isPublicVisible ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm">
                      <strong>Public Key:</strong>{" "}
                      {keyPair.isPublicVisible
                        ? keyPair.publicKeyBase58
                        : "**********"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleVisibilitySOL(index, "private")}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    {keyPair.isPrivateVisible ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm mt-2">
                      <strong>Private Key:</strong>{" "}
                      {keyPair.isPrivateVisible
                        ? keyPair.privateKeyBase58
                        : "**********"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteKeySOLPair(index)}
                  className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
      {keyETHPairArray.length > 0 ? (
        <div className="w-full max-w-4xl mt-4">
          <h2 className="text-xl font-bold mb-2 text-center">
            Generated Ethereum Key Pairs
          </h2>
          <ul className="space-y-4">
            {keyETHPairArray.map((keyPair, index) => (
              <li
                key={index}
                className="flex flex-col items-start space-y-4 bg-gray-200 dark:bg-gray-700 p-4 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleVisibilityETH(index, "public")}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    {keyPair.isPublicVisible ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm">
                      <strong>Public Key:</strong>{" "}
                      {keyPair.isPublicVisible
                        ? keyPair.publicKeyBase58
                        : "**********"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleVisibilityETH(index, "private")}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    {keyPair.isPrivateVisible ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="text-sm mt-2">
                      <strong>Private Key:</strong>{" "}
                      {keyPair.isPrivateVisible
                        ? keyPair.privateKeyBase58
                        : "**********"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteKeyETHPair(index)}
                  className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
