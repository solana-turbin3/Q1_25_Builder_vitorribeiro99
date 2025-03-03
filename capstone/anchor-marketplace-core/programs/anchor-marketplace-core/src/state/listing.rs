use anchor_lang::prelude::*;

#[account]
pub struct Listing{
    pub maker: Pubkey, // maker of the listing
    pub mint: Pubkey, // mint of the asset being listed
    pub price: u64, // price of the asset in lamports
    pub bump: u8, // bump seed for the listing PDA
}

impl Listing {
    pub const INIT_SPACE: usize = 8 + 32 + 32 + 8 + 1; // Discriminator, pubkey, pubkey, price, bump
}