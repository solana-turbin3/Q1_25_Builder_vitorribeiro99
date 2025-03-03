use anchor_lang::prelude::*;

#[account]
pub struct Monster {
    pub name: String,
    pub health: u16,     // HP
    pub min_damage: u8,  // Min attack damage
    pub max_damage: u8,  // Max attack damage
    pub xp_reward: u32,  // XP gained if defeated
}
impl Monster {
    pub const INIT_SPACE: usize = 8 + (32 + 4) + 2 + 1 + 1 + 4;  // Discriminator, Pubkey, u16, u8, u8, u32
}