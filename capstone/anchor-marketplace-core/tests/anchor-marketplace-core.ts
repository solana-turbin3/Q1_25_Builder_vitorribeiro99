import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMarketplaceCore } from "../target/types/anchor_marketplace_core";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchAssetV1, Key, mplCore } from "@metaplex-foundation/mpl-core";
import {
  createSignerFromKeypair,
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import wallet from "../../wallet/Turbin3-wallet.json";
import wallet_buyer from "../../wallet/dev-wallet.json";
import { PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { randomBytes } from "crypto";

const umi = createUmi("https://yolo-dry-silence.solana-devnet.quiknode.pro/7a7c3810f80313da7bca8637ec638f2c1c70f213").use(mplCore());

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

describe("anchor-marketplace-core", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorMarketplaceCore as Program<AnchorMarketplaceCore>;

  const seed = new BN(randomBytes(8));

  const marketplace = PublicKey.findProgramAddressSync(
    [Buffer.from("marketplace"), Buffer.from("PlaySolana")],
    program.programId
  )[0];

  const treasury = PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), marketplace.toBuffer()],
    program.programId
  )[0];
  const rewards_mint = PublicKey.findProgramAddressSync(
    [Buffer.from("rewards"), marketplace.toBuffer()],
    program.programId
  )[0];
  const listing = PublicKey.findProgramAddressSync(
    [
      marketplace.toBuffer(),
      new PublicKey("BiyCtW8tasWRTFFQ9o9fcQwVfsFLvmATSH8DNBcizjkG").toBuffer(),
    ],
    program.programId
  )[0];
  const listing2 = PublicKey.findProgramAddressSync(
    [
      marketplace.toBuffer(),
      new PublicKey("DpQvYXTqmgqJKyyJUne8wPNiFwtBzsX2cJxwQQVDqo2B").toBuffer(),
    ],
    program.programId
  )[0];

  console.log("######################################################");
  console.log("Marketplace: PlaySolana - Pubkey:", marketplace.toString());
  console.log("######################################################");



  // it("Is initialized!", async () => {
  //   const tx = await program.methods
  //     .initialize("PlaySolana", 100)
  //     .accountsPartial({
  //       admin: program.provider.publicKey,
  //       marketplace: marketplace,
  //       treasury: treasury,
  //       rewardsMint: rewards_mint,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     })
  //     .rpc({ commitment: "finalized", skipPreflight: true });
  //   console.log("Your transaction signature", tx);
  // });

  // it("Fetch an Asset", async () => {
  //   const fetchedAsset = await fetchAssetV1(
  //     umi,
  //     publicKey("BiyCtW8tasWRTFFQ9o9fcQwVfsFLvmATSH8DNBcizjkG")
  //   );

  //   console.log("\nAsset fetched:\n", fetchedAsset);
  // });

  it("List NFT 1", async () => {
    const tx = await program.methods
      .list(new anchor.BN(100))
      .accountsPartial({
        maker: program.provider.publicKey,
        makerMint: publicKey("BiyCtW8tasWRTFFQ9o9fcQwVfsFLvmATSH8DNBcizjkG"),
        marketplace: marketplace,
        listing: listing,
      })
      .rpc();

      console.log("Listing PDA Created! Your transaction signature", tx);


    const tx2 = await program.methods
      .deposit()
      .accountsPartial({
        maker: program.provider.publicKey,
        makerMint: publicKey("BiyCtW8tasWRTFFQ9o9fcQwVfsFLvmATSH8DNBcizjkG"),
        marketplace: marketplace,
        listing: listing,
      })
      .rpc();

      console.log("NFT Listed! Your transaction signature", tx2);

  });


  it("List NFT 2", async () => {
    const tx = await program.methods
      .list(new anchor.BN(10_000_000_000_000))
      .accountsPartial({
        maker: program.provider.publicKey,
        makerMint: publicKey("DpQvYXTqmgqJKyyJUne8wPNiFwtBzsX2cJxwQQVDqo2B"),
        marketplace: marketplace,
        listing: listing2,
      })
      .rpc();

      console.log("Listing PDA Created! Your transaction signature", tx);


    const tx2 = await program.methods
      .deposit()
      .accountsPartial({
        maker: program.provider.publicKey,
        makerMint: publicKey("DpQvYXTqmgqJKyyJUne8wPNiFwtBzsX2cJxwQQVDqo2B"),
        marketplace: marketplace,
        listing: listing2,
      })
      .rpc();

      console.log("NFT Listed! Your transaction signature", tx2);

  });
  
  
  it("Purchase NFT", async () => {

    let keypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(wallet_buyer));

    console.log("Buyer", keypair.publicKey.toString());


    const tx = await program.methods
      .purchase()
      .accountsPartial({
        maker: program.provider.publicKey,
        makerMint: publicKey("BiyCtW8tasWRTFFQ9o9fcQwVfsFLvmATSH8DNBcizjkG"),
        listing: listing,
        marketplace: marketplace,
        buyer: keypair.publicKey,
      })
      .signers([keypair])
      .rpc();

      console.log("Purchase NFT! Your transaction signature", tx);
  });

  it("Delist NFT 2", async () => {

    const tx = await program.methods
      .delist()
      .accountsPartial({
        maker: program.provider.publicKey,
        makerMint: publicKey("DpQvYXTqmgqJKyyJUne8wPNiFwtBzsX2cJxwQQVDqo2B"),
        listing: listing2,
        marketplace: marketplace,
        collection: publicKey("5JY6je2gA2pZZGV9jjhXVfQWtTHxfP62idkyUeKeKQCz")
      })
      .rpc();

      console.log("NFT Delisted! Your transaction signature", tx);
  });


});
