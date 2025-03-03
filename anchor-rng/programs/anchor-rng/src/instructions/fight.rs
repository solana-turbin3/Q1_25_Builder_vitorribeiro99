use anchor_lang::{prelude::*, solana_program::hash::hash};

use crate::{error::CustomError, state::{Monster, Player}};

// Constant names and stats (off-chain only)
const MONSTER_NAMES: [&str; 3] = ["Goblin", "Orc", "Dragon"];
const MONSTER_STATS: [(u16, u8, u8, u32); 3] = [
    (30, 5, 15, 10),  // Goblin
    (50, 10, 20, 20), // Orc
    (100, 20, 40, 50) // Dragon
];

// Helper function to create a Monster
pub fn generate_monster(index: usize) -> Monster {
    Monster {
        name: MONSTER_NAMES[index].to_string(), // Convert to owned String
        health: MONSTER_STATS[index].0,
        min_damage: MONSTER_STATS[index].1,
        max_damage: MONSTER_STATS[index].2,
        xp_reward: MONSTER_STATS[index].3,
    }
}

#[derive(Accounts)]
pub struct FightNPC<'info> {
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(
        mut, 
        seeds = [b"monster", player.key().as_ref()],
        bump,
    )]
    pub monster: Account<'info, Monster>,
    #[account(
        mut,
        seeds = [b"player", player.key().as_ref()],
        bump = player_account.bump,
    )]
    pub player_account: Account<'info, Player>,
    pub system_program: Program<'info, System>,
}

impl<'info> FightNPC<'info> {
    pub fn fight(&mut self, min_damage: u8, max_damage: u8) -> Result<()> {
        require!(max_damage >= min_damage, CustomError::CustomError);

        // ✅ Only generate a monster if it is NOT already active
        if self.monster.health == 0 {
            let seed = self.player.key().to_bytes();
            let blockhash = Clock::get()?.unix_timestamp.to_le_bytes();

            let hash_input = [seed.as_slice(), &blockhash].concat();
            let hash = hash(&hash_input).to_bytes();

            let mut hash_16: [u8; 16] = [0; 16];
            hash_16.copy_from_slice(&hash[0..16]);
            let lower = u128::from_le_bytes(hash_16);

            hash_16.copy_from_slice(&hash[16..32]);
            let upper = u128::from_le_bytes(hash_16);

            let monster_index = (lower.wrapping_add(upper) as usize) % MONSTER_NAMES.len();
            let monster_data = generate_monster(monster_index);

            self.monster.set_inner(Monster {
                name: monster_data.name,
                health: monster_data.health,
                min_damage: monster_data.min_damage,
                max_damage: monster_data.max_damage,
                xp_reward: monster_data.xp_reward,
            });

            msg!("A wild {} appeared! HP: {}", self.monster.name, self.monster.health);
        }

        // ✅ Generate attack power
        let attack_range = (max_damage - min_damage) + 1;
        let attack_power = (Clock::get()?.slot as u8 % attack_range) + min_damage;

        msg!("Player attacks {} for {} damage!", self.monster.name, attack_power);

        if attack_power as u16 >= self.monster.health {
            self.player_account.xp = self.player_account.xp
                .checked_add(self.monster.xp_reward)
                .unwrap_or(self.player_account.xp);

            msg!("{} defeated! Player gains {} XP.", self.monster.name, self.monster.xp_reward);

            // ✅ Reset monster health (mark as defeated)
            self.monster.health = 0;
        } else {
            self.monster.health -= attack_power as u16;
            msg!("{} survived with {} HP left!", self.monster.name, self.monster.health);
        }

        Ok(())
    }
}
