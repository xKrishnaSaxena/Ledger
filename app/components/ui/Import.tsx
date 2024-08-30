import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  importWalletFromKey,
  importWalletFromMnemonic,
} from "@/utils/importWallet";
import { useState } from "react";

interface ImportProps {
  setKeySOLPairArray: React.Dispatch<React.SetStateAction<any[]>>;
  keySOLPairArray: any[];
}

export default function Import({ setKeySOLPairArray }: ImportProps) {
  const [method, setMethod] = useState<"privateKey" | "seedPhrase">(
    "privateKey"
  );
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleImport = async () => {
    try {
      let wallet;
      if (method === "privateKey") {
        wallet = await importWalletFromKey(inputValue);
      } else {
        wallet = await importWalletFromMnemonic(inputValue);
      }

      if (wallet) {
        const { publicKeyBase58, privateKeyBase58 } = wallet;

        setKeySOLPairArray((prevArray) => {
          const newArray = [
            ...prevArray,
            {
              privateKeyBase58,
              publicKeyBase58,
              isPublicVisible: false,
              isPrivateVisible: false,
              balance: 0,
            },
          ];
          localStorage.setItem("keySOLPairArray", JSON.stringify(newArray));
          return newArray;
        });

        setError(null);
        setOpen(false);
        setInputValue("");
      } else {
        setError("Invalid wallet information. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during wallet import.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-500 text-white ml-4 py-3 mt-5 px-6 rounded-md text-lg">
          Import Wallet
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-white">Import Wallet</DialogTitle>
        <div className="mt-4">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${
                method === "privateKey"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setMethod("privateKey")}
            >
              Private Key
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                method === "seedPhrase"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setMethod("seedPhrase")}
            >
              Seed Phrase
            </button>
          </div>
          <input
            type="text"
            placeholder={
              method === "privateKey"
                ? "Enter your private key"
                : "Enter your seed phrase"
            }
            className="w-full px-4 py-2 border rounded-md"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-lightGray text-white rounded-md"
          >
            Import
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
