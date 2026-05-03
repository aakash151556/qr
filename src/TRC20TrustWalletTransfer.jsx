import React, { useState } from "react";

const TRC20TrustWalletTransfer = () => {
  const [toAddress, setToAddress] = useState("TC5t163mn46nZNkXTvZ8KedJDbWKeWXWYV");
  const [amount, setAmount] = useState(1);
  const [memo, setMemo] = useState("");

  // 🔗 Generate Trust Wallet Deep Link
  const generateLink = () => {
    if (!toAddress || !amount) {
      alert("Please enter address and amount");
      return;
    }

    let url = `https://link.trustwallet.com/send?coin=195&address=${toAddress}&amount=${amount}`;

    if (memo) {
      url += `&memo=${encodeURIComponent(memo)}`;
    }

    return url;
  };

  // 🚀 Open Trust Wallet
  const sendToken = () => {
    const url = generateLink();
    if (!url) return;

    // Mobile → opens Trust Wallet
    window.location.href = url;
  };

  // 💻 Desktop → show QR
  const [qrLink, setQrLink] = useState("");

  const generateQR = () => {
    const url = generateLink();
    if (!url) return;

    setQrLink(url);
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>TRC20 Transfer (Trust Wallet)</h2>

      <label>Receiver Address</label>
      <input
        type="text"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Amount (USDT)</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Memo (Optional)</label>
      <input
        type="text"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        style={{ width: "100%", marginBottom: 20 }}
      />

      <button onClick={sendToken} style={{ width: "100%", marginBottom: 10 }}>
        🚀 Open Trust Wallet & Send
      </button>

      <button onClick={generateQR} style={{ width: "100%" }}>
        📱 Generate QR (for Desktop)
      </button>

      {qrLink && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <p>Scan with Trust Wallet</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrLink)}`}
            alt="QR Code"
          />
        </div>
      )}
    </div>
  );
};

export default TRC20TrustWalletTransfer;