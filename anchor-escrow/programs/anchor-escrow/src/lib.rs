use anchor_lang::prelude::*;

declare_id!("8dwxJu1sJwbbFji16Ek78Vp5xqWY28ZiPVepGsjD5BHw");

pub mod state;
pub use state::*;

pub mod instructions;
pub use instructions::*;

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Make>, seed: u64, receive: u64, deposit: u64) -> Result<()> {
        ctx.accounts.init_escrow(seed, receive, &ctx.bumps)?;
        ctx.accounts.deposit(deposit)
    }


}
