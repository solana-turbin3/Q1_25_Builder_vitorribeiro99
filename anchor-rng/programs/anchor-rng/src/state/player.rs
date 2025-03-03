use anchor_lang::prelude::*;    

#[account]
pub struct Player {
    pub user: Pubkey,  // Player’s wallet address
    pub name: String,  // Player’s name
    pub xp: u32,      // Player experience points
    pub level: u8,    // Player level
    pub bump: u8,     // Bump seed
}

impl Player {
    pub const INIT_SPACE: usize = 8 + 32 + (32 + 4)+ 4 + 1 + 1;  // Discriminator, Pubkey, bump,(name + string's length for serialization) 
}