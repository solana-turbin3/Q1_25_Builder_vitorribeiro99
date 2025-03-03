use anchor_lang::prelude::*;

declare_id!("EopDFbPSwgJ2p7aGvgFafwfrHVJ8G7NXDajBD4HYdi7Y");


mod state;
mod instructions;
mod error;

use instructions::*;
use error::*;

#[program]
pub mod anchor_rng {

    use super::*;

    pub fn initialize_player(ctx: Context<InitializePlayer>, name: String) -> Result<()> {
        ctx.accounts.init_player(name, &ctx.bumps)?;
        Ok(())
    }
    pub fn fight(ctx: Context<FightNPC>, min_damage: u8, max_damage: u8) -> Result<()> {
        ctx.accounts.fight(min_damage, max_damage)?;
        Ok(())
    }
}