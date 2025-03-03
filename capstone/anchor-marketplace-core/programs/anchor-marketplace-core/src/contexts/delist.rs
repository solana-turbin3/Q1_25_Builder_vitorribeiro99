use anchor_lang::prelude::*;

use std::str::FromStr;

use mpl_core::instructions::TransferV1CpiBuilder;

use crate::state::{Listing, Marketplace};


#[derive(Accounts)]
pub struct Delist<'info>{
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump,
    )]
    pub marketplace: Account<'info, Marketplace>,
    /// CHECK: This is verified by the CPI
    #[account(mut)]
    pub maker_mint: UncheckedAccount<'info>,
    /// CHECK: This is verified by the CPI
    #[account(mut, address = Pubkey::from_str("5JY6je2gA2pZZGV9jjhXVfQWtTHxfP62idkyUeKeKQCz").unwrap())]
    pub collection: UncheckedAccount<'info>,
    #[account(
        mut,
        close = maker,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, Listing>,
    pub system_program: Program<'info, System>,
    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
}


impl <'info> Delist<'info>{

    pub fn withdraw_nft(&mut self) -> Result<()> {

        let binding = self.maker_mint.key();
        let binding2 = self.marketplace.key();
        
        let signer_seeds: [&[&[u8]]; 1] = [&[
            binding2.as_ref(),
            binding.as_ref(),
            &[self.listing.bump]
        ]];

        TransferV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
            .asset(&self.maker_mint.to_account_info())
            .authority(Some(&self.listing.to_account_info()))
            .payer(&self.maker.to_account_info())
            .new_owner(&self.maker.to_account_info()) // authority back to the user/maker
            .collection(Some(&self.collection.to_account_info()))
            .system_program(Some(&self.system_program.to_account_info()))
            .invoke_signed(&signer_seeds)?;

        Ok(())
    }
}