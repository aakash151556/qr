import React, { useEffect, useState } from "react";

const TRC20Transfer = () => {
  const [account, setAccount] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT
  const RECEIVER = "TC5t163mn46nZNkXTvZ8KedJDbWKeWXWYV";

  // ✅ Detect device
  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(mobile);

    // Desktop TronLink detection
    if (window.tronWeb && window.tronWeb.defaultAddress?.base58) {
      setAccount(window.tronWeb.defaultAddress.base58);
    }
  }, []);

  // ✅ Connect TronLink (Desktop)
  const connectTronLink = async () => {
    try {
      if (!window.tronLink) {
        alert("Please install TronLink");
        return;
      }

      await window.tronLink.request({ method: "tron_requestAccounts" });

      if (window.tronWeb?.defaultAddress?.base58) {
        setAccount(window.tronWeb.defaultAddress.base58);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Mobile Transfer (Trust Wallet Deep Link)
  const sendUSDTMobile = () => {
    const amount = 1;

    const url = `https://link.trustwallet.com/send?coin_id=195&address=${RECEIVER}&amount=${amount}&contract_address=${CONTRACT}`;

    window.location.href = url;
  };

  // ✅ Desktop Transfer (TronLink)
  const sendUSDTDesktop = async () => {
    try {
      if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
        alert("Connect TronLink first");
        return;
      }

      const tronWeb = window.tronWeb;

      const contract = await tronWeb.contract().at(CONTRACT);

      const tx = await contract
        .transfer(RECEIVER, tronWeb.toSun(1)) // 1 USDT
        .send();

      console.log("TX:", tx);
      alert("Transaction sent!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Transaction failed");
    }
  };

  // ✅ Unified handler
  const sendUSDT = () => {
    if (isMobile) {
      sendUSDTMobile();
    } else {
      sendUSDTDesktop();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>TRC20 USDT Transfer</h2>

      {!isMobile && (
        <>
          {!account ? (
            <button onClick={connectTronLink}>
              Connect TronLink
            </button>
          ) : (
            <p>Connected: {account}</p>
          )}
        </>
      )}

      <button onClick={sendUSDT} style={{ marginTop: 20 }}>
        Send 1 USDT
      </button>

      {isMobile && (
        <p style={{ marginTop: 10 }}>
          Mobile: Opens Trust Wallet automatically
        </p>
      )}
    </div>
  );
};

export default TRC20Transfer;