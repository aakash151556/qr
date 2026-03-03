import React, { useState } from "react";
import { connectTronWallet, getTronAddress } from "./walletConnect";

export default function ConnectButton() {
  const [address, setAddress] = useState("");

  const handleConnect = async () => {
    try {
      const session = await connectTronWallet();
      const tronAddress = getTronAddress();
      setAddress(tronAddress);
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  return (
    <div>
      <button onClick={handleConnect}>
        Connect Trust Wallet (TRON)
      </button>

      {address && (
        <p>Connected: {address}</p>
      )}
    </div>
  );
}