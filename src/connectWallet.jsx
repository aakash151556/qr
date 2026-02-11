

import { ethers } from "ethers";
import erc20ABI from "./abi/ERC20.json";


const BSC_MAINNET = {
  chainId: "0x38", // 56,
  chainIdDec: 56, // 56
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask or Trust Wallet");
      return null;
    }
    const isTrustWallet =
  window.ethereum?.isTrust ||
  window.ethereum?.provider?.isTrust;


    
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const selectedAccount = accounts[0];

    
    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });

        
    if (chainIdHex!==BSC_MAINNET.chainIdDec && chainIdHex!==BSC_MAINNET.chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_MAINNET.chainId }],
        });
      } catch (error) {
        
        if (error.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [BSC_MAINNET],
          });
        } else {
          alert("Network switch rejected");
          return null;
        }
      }
    }

    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    
    const usdtContract = new ethers.Contract(
      import.meta.env.VITE_USDT_CONTRACT,
      erc20ABI,
      signer
    );
  

    return {
      signer,
      provider,
      selectedAccount,
      usdtContract,
    
      chainId: 56,
    };
  } catch (err) {
    console.error("connectWallet error:", err);
    return null;
  }
};
