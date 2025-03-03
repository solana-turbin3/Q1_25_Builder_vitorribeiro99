use anchor_lang::prelude::*;
use crate::state::Player;

#[derive(Accounts)]
#[instruction()]
pub struct InitializePlayer<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        init,
        payer = player,
        seeds = [b"player", player.key().as_ref()],
        bump,
        space = Player::INIT_SPACE
    )]
    pub player_account: Account<'info, Player>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializePlayer<'info> {
    pub fn init_player(&mut self, name: String, bumps: &InitializePlayerBumps) -> Result<()> {
        self.player_account.set_inner(Player {
            user: self.player.key(),
            name,
            bump: bumps.player_account,
            xp: 0,      // Default starting XP
            level: 0,   // Default level
        });

        Ok(())
    }
}

// pub struct Monster {
//     pub owner: Pubkey,      // Who created/ownes the monster
//     pub min_damage: u16,    // Minimum attack damage
//     pub max_damage: u16,    // Maximum attack damage
//     pub attack_seed: u64,   // A random seed for generating attacks ??
// }