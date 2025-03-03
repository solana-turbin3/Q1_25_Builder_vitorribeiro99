use anchor_lang::prelude::*;    

#[account]
pub struct Marketplace {
    pub admin: Pubkey, // admin of the marketplace
    pub fee: u16, // fee charged in each transaction (basis points)
    pub bump: u8, // bump seed for the marketplace PDA
    pub treasury_bump: u8, // bump seed for the marketplace treasury PDA
    pub rewards_bump: u8, // bumo seed for the rewards mint PDA
    pub name: String, // marketplace name/identifier
}
impl Marketplace {
    pub const INIT_SPACE: usize = 8 + 32 + 2 + 1 + 1 + 1 + (32 + 4); // Discriminator, Pubkey, fee, bump, treasury_bump, reward_bump, (name + string's length for serialization) 
}
