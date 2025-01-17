import { config } from "dotenv";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "../../../wallet/Turbin3-wallet.json";

// Load environment variables
config();

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection(
  process.env.RPC_URL || "https://api.devnet.solana.com"
);

const github = Buffer.from("vitorribeiro99", "utf8");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Create the PDA for our enrollment account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId
);

//
(async () => {
  try {
    const txhash = await program.methods
      .complete(github)
      .accounts({ signer: keypair.publicKey })
      .signers([keypair])
      .rpc();

    console.log(
      `Success! Check out your TX here: https://solana.fm/tx/${txhash}?cluster=devnet-solana`
    );
  } catch (error) {
    console.error("Oops, something went wrong:", error);
  }
})();
