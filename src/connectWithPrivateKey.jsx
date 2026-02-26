import { ethers } from "ethers";
import erc20ABI from "./abi/ERC20.json";

const NETWORKS = {
  BSC: {
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org/",
    usdtEnvKey: "VITE_USDT_CONTRACT_BSC",
  },

  ETH: {
    chainId: 1,
    rpcUrl: "https://rpc.ankr.com/eth",
    usdtEnvKey: "VITE_USDT_CONTRACT_ETH",
  },
};

export const connectWithPrivateKey = async (
  privateKey,
  network = "BSC"
) => {
  try {
    const net = NETWORKS[network];

    if (!net) {
      throw new Error("Invalid network");
    }

    if (!privateKey) {
      throw new Error("Private key required");
    }

    // Provider
    const provider = new ethers.JsonRpcProvider(net.rpcUrl);

    // Wallet from private key
    const wallet = new ethers.Wallet(privateKey, provider);

    // USDT contract
    const usdtAddress = import.meta.env[net.usdtEnvKey];

    if (!usdtAddress) {
      throw new Error(`Missing env: ${net.usdtEnvKey}`);
    }

    const usdtContract = new ethers.Contract(
      usdtAddress,
      erc20ABI,
      wallet
    );

    return {
      signer: wallet,
      provider,
      selectedAccount: wallet.address,
      usdtContract,
      chainId: net.chainId,
      network,
    };
  } catch (err) {
    console.error("connectWithPrivateKey error:", err);
    return null;
  }
};