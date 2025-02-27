use anchor_lang::prelude::*;

declare_id!("GqxPoZdvvn7TJ2mNBmEhyYTRLHnNLRmHMMmtQYe8CE48");


pub mod state;
pub mod error;
pub mod instructions;

pub use instructions::*;

#[program]
pub mod nft_staking {
    use instructions::InitializeConfig;

    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>, points_per_stake: u8, max_stake: u8, freeze_period: u32) -> Result<()> {
        ctx.accounts.initialize_config(points_per_stake, max_stake, freeze_period, &ctx.bumps)
    }
    
    pub fn initialize_user(ctx: Context<InitializeUser>,) -> Result<()> {
        ctx.accounts.initialize_user_account(&ctx.bumps)
    }

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.stake(&ctx.bumps)
    }

}

