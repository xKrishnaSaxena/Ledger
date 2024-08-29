"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [text, setText] = useState("");
  const [isUnwrapping, setIsUnwrapping] = useState(true);
  const heading = "Welcome to Ledger Wallet!";
  const router = useRouter();

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (isUnwrapping) {
        setText(heading.slice(0, index + 1));
        index += 1;
      } else {
        index -= 1;
        setText(heading.slice(0, index));
        if (index === 0) {
          setTimeout(() => setIsUnwrapping(true), 1000);
        }
      }
    }, 70);

    return () => clearInterval(intervalId);
  }, [isUnwrapping]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1
        className="text-4xl text-white mb-2 mr-5 transition-all duration-300 ease-in-out"
        style={{ transition: "opacity 0.5s ease-in-out" }}
      >
        {text}
      </h1>
      <h2 className="text-2xl text-customGray mb-8">
        Create Solana and Ethereum accounts, manage transactions, and check your
        balances.
      </h2>
      <button
        className="mt-8 mr-5 px-6 py-3 bg-white text-black text-lg font-semibold rounded hover:bg-customGray transition duration-300"
        onClick={() => {
          router.push("/mnemonic");
        }}
      >
        Get Started
      </button>
    </div>
  );
}
