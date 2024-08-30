"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Keypair } from "@solana/web3.js";
import { sendSolanaTransaction } from "@/utils/solRpcMethods";
import Spinner from "./Spinner";
import bs58 from "bs58";

export default function Send(wallet: any) {
  const fromPublicAddress = wallet.wallet.publicKeyBase58;
  const privateKey = wallet.wallet.privateKeyBase58;

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState<Boolean>(false);

  const handleSubmit = async () => {
    if (!toAddress || !amount) {
      alert("Please enter both the address and amount.");
      return;
    }

    try {
      setLoading(true);
      const fromKeypair = Keypair.fromSecretKey(
        bs58.decode(privateKey.toString())
      );

      const lamports = parseFloat(amount) * 1_000_000_000;

      const transactionSignature = await sendSolanaTransaction(
        fromKeypair,
        toAddress,
        lamports
      );
      wallet.wallet.balance = wallet.wallet.balance - parseFloat(amount);
      setLoading(false);

      alert(
        `Transaction sent successfully! Signature: ${transactionSignature}`
      );
    } catch (error) {
      console.error("Transaction failed:", error);
      setLoading(false);
      alert("Failed to send transaction. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Send</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Send Solana</DialogTitle>
          <DialogDescription>
            Enter the recipient&apos;s address and the amount of SOL to send.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addressFrom" className="text-right text-white">
                From
              </Label>
              <Input
                id="addressFrom"
                value={fromPublicAddress}
                className="col-span-3 text-white"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addressTo" className="text-right text-white">
                To
              </Label>
              <Input
                id="addressTo"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="col-span-3 text-white"
                placeholder="Recipient Address"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right text-white">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3 text-white"
                placeholder="Amount in SOL"
              />
            </div>
          </div>
        )}
        {!loading && (
          <DialogFooter>
            <Button onClick={handleSubmit} className="bg-blue-500 text-white">
              Send
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
