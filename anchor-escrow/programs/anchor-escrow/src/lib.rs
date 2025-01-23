use anchor_lang::prelude::*;

declare_id!("8dwxJu1sJwbbFji16Ek78Vp5xqWY28ZiPVepGsjD5BHw");

pub mod state;
pub use state::*;

pub mod instructions;
pub use instructions::*;

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn make(ctx: Context<Make>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

