import { config } from "dotenv";
import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import wallet from "../wallet/Turbin3-wallet.json";

// Load environment variables
config();

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("D3meZbenDsK7GF1ZV9th3x5u1oSA8rFRc2FvQCDNoHeb");

// Recipient address
const to = new PublicKey("BkzDWpverYNSRXsobMEqjNrsCRtThQaHbWZxNZ5zvjyX");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );
    // Transfer the new token to the "toTokenAccount" we just created
    const transaction = await transfer(
      connection,
      keypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      keypair.publicKey,
      1e6
    );

    console.log(
      `Your transaction signature is: https://solscan.io/tx/${transaction}`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
