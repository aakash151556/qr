import React, { useState } from "react";
import SignClient from "@walletconnect/sign-client";
import {TronWeb} from "tronweb";

const TRC20Transfer = () => {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);
  const [account, setAccount] = useState("");

  const PROJECT_ID = "e9e961dfed2388640ac5072a50463310";

  // 🔌 Connect Wallet
  const connectWallet = async () => {
    try {
      const wcClient = await SignClient.init({
        projectId: PROJECT_ID,
        metadata: {
          name: "TRC20 Pay",
          description: "TRC20 Payment DApp",
          url: "https://qr-tau-nine.vercel.app/TRC20Transfer",
          icons: []
        }
      });

      const { uri, approval } = await wcClient.connect({
        requiredNamespaces: {
          tron: {
            methods: ["tron_signTransaction"],
            chains: ["tron:0x2b6653dc"], // TRON mainnet
            events: []
          }
        }
      });

      // 📱 Open Trust Wallet
      if (uri) {
        const deepLink = `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`;
        window.open(deepLink, "_blank");
      }

      const session = await approval();
      setClient(wcClient);
      setSession(session);

      const acc = session.namespaces.tron.accounts[0];
      const address = acc.split(":")[2];
      setAccount(address);

    } catch (err) {
      console.error("Connection error:", err);
    }
  };


const sendUSDT = async () => {
  if (!client || !session) {
    alert("Connect wallet first");
    return;
  }

  try {
    const tronWeb = new TronWeb({
      fullHost: "https://api.trongrid.io",
    });
console.log("TronWeb initialized:", tronWeb);
    const fromAddress = session.namespaces.tron.accounts[0].split(":")[2];

    const contractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT
    const toAddress = "TC5t163mn46nZNkXTvZ8KedJDbWKeWXWYV";

    const amount = tronWeb.toSun(1); // 1 USDT

    // 🔥 VERY IMPORTANT → convert to HEX
    const ownerHex = tronWeb.address.toHex(fromAddress);
    const toHex = tronWeb.address.toHex(toAddress);

    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      tronWeb.address.toHex(contractAddress),
      "transfer(address,uint256)",
      {
        feeLimit: 100000000, // required
      },
      [
        { type: "address", value: toHex },
        { type: "uint256", value: amount },
      ],
      ownerHex
    );

    if (!tx.result || !tx.result.result) {
      throw new Error("Transaction build failed");
    }

    // 👉 Send to wallet for signing
    const signedTx = await client.request({
      topic: session.topic,
      chainId: "tron:0x2b6653dc",
      request: {
        method: "tron_signTransaction",
        params: {
          transaction: tx.transaction,
        },
      },
    });

    // 👉 Broadcast manually
    const broadcast = await tronWeb.trx.sendRawTransaction(signedTx);

    console.log("Broadcast:", broadcast);
    alert("Transaction sent!");

  } catch (error) {
    console.error(error);
    alert(error.message || error);
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>TRC20 Transfer (Trust Wallet)</h2>

      {!account ? (
        <button onClick={connectWallet}>Connect Trust Wallet</button>
      ) : (
        <p>Connected: {account}</p>
      )}

      <button onClick={sendUSDT} disabled={!account}>
        Send 1 USDT
      </button>
    </div>
  );
};

export default TRC20Transfer;