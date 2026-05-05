import React, { useState } from "react";

const TRC20TransferTrustWallet = () => {
  const [to, setTo] = useState("TC5t163mn46nZNkXTvZ8KedJDbWKeWXWYV");
  const [amount, setAmount] = useState("");

  // Example: USDT TRC20 contract
  const CONTRACT = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"; // USDT
  const DECIMALS = 6;

  const handleTransfer = () => {
    if (!to || !amount) {
      alert("Please enter address and amount");
      return;
    }

    // Convert amount to smallest unit
    const rawAmount = Number(amount) * Math.pow(10, DECIMALS);

    // Trust Wallet deep link
    const url = `https://link.trustwallet.com/send?coin_id=195&contract=${CONTRACT}&address=${to}&amount=${rawAmount}`;

    // Open wallet
    window.location.href = url;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h2>TRC20 Transfer (Trust Wallet)</h2>

      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="number"
        placeholder="Amount (e.g. 1 USDT)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={handleTransfer}>
        Send via Trust Wallet
      </button>
    </div>
  );
};

export default TRC20TransferTrustWallet;