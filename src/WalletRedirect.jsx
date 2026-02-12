import React, { useEffect } from "react";

export default function WalletRedirect({ children }) {
  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // If desktop, do nothing
    if (!isMobile) return;

    const eth = window.ethereum;

    // Already inside a wallet DApp browser (no redirect)
    const isInWallet =
      eth?.isMetaMask ||
      eth?.isTrust ||
      eth?.isCoinbaseWallet ||
      eth?.isTokenPocket ||
      eth?.isOKExWallet ||
      eth?.isBitKeep ||
      eth?.isRabby ||
      eth?.isMathWallet;

    if (isInWallet) return;

    // Current URL
    const fullUrl = window.location.href;

    // MetaMask deeplink (no https:// inside)
    const mm = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}${window.location.search}`;

    // TrustWallet deeplink (url encoded)
    const tw = `https://link.trustwallet.com/open_url?url=${encodeURIComponent(
      fullUrl
    )}`;

    // If user has TrustWallet installed and opens QR from TrustWallet scanner,
    // it will handle automatically. If from Chrome, we can try MetaMask first.
    // (You can swap order if you prefer TrustWallet first)
    // Try MetaMask first
    window.location.href = mm;

    // Fallback to TrustWallet after 1.5 sec
    setTimeout(() => {
      window.location.href = tw;
    }, 1500);
  }, []);

  return children;
}
