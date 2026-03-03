import SignClient from "@walletconnect/sign-client";

let client;
let session;

export async function initWalletConnect() {
  client = await SignClient.init({
    projectId: "e9e961dfed2388640ac5072a50463310", // get from walletconnect.com
    metadata: {
      name: "TRON Transfer DApp",
      description: "TRC20 Payment",
      url: "https://qr-tau-nine.vercel.app/transfertrc20?account=TC5t163mn46nZNkXTvZ8KedJDbWKeWXWYV",
      icons: ["https://yourdomain.com/logo.png"],
    },
  });

  return client;
}

export async function connectTronWallet() {
  if (!client) await initWalletConnect();

  const { uri, approval } = await client.connect({
    requiredNamespaces: {
      tron: {
        methods: [
          "tron_signTransaction",
          "tron_signMessage",
        ],
        chains: ["tron:0x2b6653dc"], // TRON mainnet
        events: [],
      },
    },
  });

  // Open Trust Wallet automatically
  if (uri) {
    window.location.href =
      `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`;
  }

  session = await approval();
  return session;
}

export function getTronAddress() {
  if (!session) return null;
  return session.namespaces.tron.accounts[0].split(":")[2];
}