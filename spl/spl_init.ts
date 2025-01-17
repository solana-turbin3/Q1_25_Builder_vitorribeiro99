import { config } from "dotenv";
import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "../wallet/Turbin3-wallet.json";

// Load environment variables
config();

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection(
  process.env.RPC_URL || "https://api.devnet.solana.com",
  commitment
);

(async () => {
  try {
    // Start here
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      null,
      6
    );
    console.log(`Mint address: ${mint}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();

// Mint address: D3meZbenDsK7GF1ZV9th3x5u1oSA8rFRc2FvQCDNoHeb
