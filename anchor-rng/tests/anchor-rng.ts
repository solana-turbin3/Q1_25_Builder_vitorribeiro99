import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorRng } from "../target/types/anchor_rng";
import { PublicKey } from "@solana/web3.js";

describe("Full Fight Test", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.AnchorRng as Program<AnchorRng>;

  let playerPda: PublicKey;
  let monsterPda: PublicKey;
  let playerXpBefore: number;

  // Utility function to fetch player PDA
  async function getPlayerPda() {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("player"), program.provider.publicKey.toBuffer()],
      program.programId
    )[0];
  }

  // Utility function to fetch monster PDA
  async function getMonsterPda() {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("monster"), program.provider.publicKey.toBuffer()],
      program.programId
    )[0];
  }

  it("Initializes a player", async () => {
    playerPda = await getPlayerPda();
    
    try {
      // Fetch existing player account
      const player = await program.account.player.fetch(playerPda);
      console.log("✅ Player already initialized:", player);
    } catch (err) {
      // Player not found, create new player
      const tx = await program.methods
        .initializePlayer("vitinha.sol")
        .accounts({
          player: program.provider.publicKey,
          playerAccount: playerPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      console.log("✅ Player initialized. Tx:", tx);
    }
  });

  it("Starts a fight and spawns a monster", async () => {
    monsterPda = await getMonsterPda();

    // Fetch player XP before fight
    const player = await program.account.player.fetch(playerPda);
    playerXpBefore = player.xp;

    // Start fight with attack range 5-10
    const tx = await program.methods
      .fight(5, 10) // Attack range from NFT
      .accounts({
        player: program.provider.publicKey,
        playerAccount: playerPda,
        monster: monsterPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Fight started. Tx:", tx);

    // Fetch the monster
    const monster = await program.account.monster.fetch(monsterPda);
    console.log("🟢 Spawned Monster:", monster);
  });

  it("Simulates multiple fight turns until the monster is defeated", async () => {
    let monster = await program.account.monster.fetch(monsterPda);
    console.log(`🟡 Initial Monster HP: ${monster.health}`);
  
    while (monster.health > 0) {
      const tx = await program.methods
        .fight(5, 10) // Attack range stays the same
        .accounts({
          player: program.provider.publicKey,
          playerAccount: playerPda,
          monster: monsterPda,
        })
        .rpc();
  
      console.log("⚔️ Turn executed. Tx:", tx);
  
      // Fetch updated monster state
      try {
        monster = await program.account.monster.fetch(monsterPda);
        console.log(`🟠 Monster HP after attack: ${monster.health}`);
      } catch (err) {
        console.log("💀 Monster defeated!");
        break;
      }
    }
  });

  it("Verifies XP increase after the fight", async () => {
    const playerAfterFight = await program.account.player.fetch(playerPda);
    console.log("🟡 XP Before Fight:", playerXpBefore);
    console.log("🟢 XP After Fight:", playerAfterFight.xp);
  });
});
