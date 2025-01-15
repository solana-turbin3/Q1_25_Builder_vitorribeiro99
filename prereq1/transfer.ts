import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";

// Dev Wallet Keypair from the file
const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Turbin3 public key
const to = new PublicKey("8ZkXfo2Mdv9StnXRVjF9UiMF8deA3Lrhd8qRHycojtB4");

const connection = new Connection(
  "https://yolo-dry-silence.solana-devnet.quiknode.pro/7a7c3810f80313da7bca8637ec638f2c1c70f213"
);

(async () => {
  try {
    // Get balance of dev wallet
    const balance = await connection.getBalance(from.publicKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance ?? LAMPORTS_PER_SOL / 100,
      })
    );
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction.feePayer = from.publicKey;

    transaction.instructions.pop();

    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      })
    );

    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);
    // Success
    console.log(
      `Success! Check out your TX here: https://solana.fm/tx/${signature}?cluster=devnet-solana`
    );
  } catch (error) {
    console.error("Oops, something went wrong:", error);
  }
})();
