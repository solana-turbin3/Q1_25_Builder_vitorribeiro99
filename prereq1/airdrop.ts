import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection(
  "https://yolo-dry-silence.solana-devnet.quiknode.pro/7a7c3810f80313da7bca8637ec638f2c1c70f213"
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
