import { config } from "dotenv";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "../../../wallet/dev-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection(
  process.env.RPC_URL || "https://api.devnet.solana.com"
);

(async () => {
  try {
    // claim 2 devnet SOL tokens
    const txhash = await connection.requestAirdrop(
      keypair.publicKey,
      LAMPORTS_PER_SOL * 2
    );

    console.log(
      `Success! Check out your TX here: https://solana.fm/tx/${txhash}?cluster=devnet-solana`
    );
  } catch (error) {
    console.error("Oops, something went wrong:", error);
  }
})();
