use anchor_lang::prelude::*;

declare_id!("4LXsSqX7p2UVLvKc9rm5TvmHuFCyWrwG1BwetwYNYvSP");

mod instructions;

pub use instructions::*;


#[program]
pub mod anchor_core_nft_staking {
    use super::*;

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.stake()?;
        Ok(())
    }
    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        ctx.accounts.unstake()?;
        Ok(())
    }
}

