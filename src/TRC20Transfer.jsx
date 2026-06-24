import React, { useState } from "react";
import SignClient from "@walletconnect/sign-client";
import { WalletConnectModal } from "@walletconnect/modal";
import { TronWeb } from "tronweb";

export default function TRC20Transfer() {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);

  const PROJECT_ID = "e9e961dfed2388640ac5072a50463310";

  const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

  const RECEIVER = "TC5t163mn46nZNkXTvZ8KedJDbWKeWXWYV";

  const connectWallet = async () => {
    try {
      setLoading(true);

      const wcClient = await SignClient.init({
        projectId: PROJECT_ID,
        metadata: {
          name: "TRC20 Pay",
          description: "TRC20 Payment DApp",
          url: window.location.origin,
          icons: [],
        },
      });
      const modal = new WalletConnectModal({
        projectId: PROJECT_ID,
      });
      const { uri, approval } = await wcClient.connect({
        requiredNamespaces: {
          tron: {
            methods: ["tron_signTransaction"],
            chains: ["tron:0x2b6653dc"],
            events: [],
          },
        },
      });

      if (uri) {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isMobile) {
          window.location.href = `https://link.trustwallet.com/wc?uri=${encodeURIComponent(
            uri,
          )}`;
        } else {
          await modal.openModal({
            uri,
          });
        }
      }

      const approvedSession = await approval();

      setClient(wcClient);
      setSession(approvedSession);

      const acc = approvedSession.namespaces.tron.accounts[0];

      const walletAddress = acc.split(":")[2];

      setAccount(walletAddress);

      console.log("Connected:", walletAddress);
    } catch (err) {
      console.error(err);
      alert(err.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const sendUSDT = async () => {
    if (!client || !session) {
      alert("Connect wallet first");
      return;
    }

    try {
      setLoading(true);

      const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
      });

      const fromAddress = session.namespaces.tron.accounts[0].split(":")[2];

      const amount = 1 * 1000000; // 1 USDT

      const tx = await tronWeb.transactionBuilder.triggerSmartContract(
        USDT_CONTRACT,
        "transfer(address,uint256)",
        {
          feeLimit: 100000000,
        },
        [
          {
            type: "address",
            value: RECEIVER,
          },
          {
            type: "uint256",
            value: amount,
          },
        ],
        fromAddress,
      );

      if (!tx.result?.result) {
        throw new Error("Transaction build failed");
      }

      console.log("UNSIGNED:", tx.transaction);

      let signedTx;

      try {
        signedTx = await client.request({
          topic: session.topic,
          chainId: "tron:0x2b6653dc",
          request: {
            method: "tron_signTransaction",
            params: {
              transaction: tx.transaction,
            },
          },
        });
      } catch (e) {
        signedTx = await client.request({
          topic: session.topic,
          chainId: "tron:0x2b6653dc",
          request: {
            method: "tron_signTransaction",
            params: [tx.transaction],
          },
        });
      }

      console.log("SIGNED:", signedTx);

      let transactionToBroadcast;

      if (signedTx?.signature && !signedTx?.raw_data) {
        transactionToBroadcast = {
          ...tx.transaction,
          signature: signedTx.signature,
        };
      } else if (signedTx?.transaction) {
        transactionToBroadcast = signedTx.transaction;
      } else {
        transactionToBroadcast = signedTx;
      }

      console.log("BROADCAST TX:", transactionToBroadcast);

      const result = await tronWeb.trx.sendRawTransaction(
        transactionToBroadcast,
      );

      console.log("BROADCAST RESULT:", result);

      if (result.result) {
        alert(`Success\nTXID: ${result.txid}`);
      } else {
        alert(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      console.error(err);
      alert(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Trust Wallet TRC20 Transfer</h2>

      {!account ? (
        <button onClick={connectWallet} disabled={loading}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p>
            Connected:
            <br />
            {account}
          </p>

          <button onClick={sendUSDT} disabled={loading}>
            Send 1 USDT
          </button>
        </>
      )}
    </div>
  );
}
