export async function getEthereumBalance(account: string): Promise<any> {
  const response = await fetch("https://api.devnet.solana.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [account],
    }),
  });

  return await response.json();
}

export default {
  getEthereumBalance,
};
