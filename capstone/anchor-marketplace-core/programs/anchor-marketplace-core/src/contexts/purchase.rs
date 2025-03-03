use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

use std::str::FromStr;

use anchor_spl::token_interface::Mint;
use mpl_core::instructions::TransferV1CpiBuilder;

use crate::state::{Listing, Marketplace};

#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub maker: SystemAccount<'info>,
    /// CHECK: This is verified by the CPI
    #[account(mut)]
    pub maker_mint: UncheckedAccount<'info>,
    #[account(
        mut,
        close = maker,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, Listing>,
    /// CHECK: This is verified by the CPI
    #[account(mut, address = Pubkey::from_str("5JY6je2gA2pZZGV9jjhXVfQWtTHxfP62idkyUeKeKQCz").unwrap())]
    pub collection: UncheckedAccount<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump,
    )]
    pub marketplace: Account<'info, Marketplace>,
    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump,
    )]
    pub treasury: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"rewards", marketplace.key().as_ref()],
        bump = marketplace.rewards_bump,
        mint::decimals = 6,
        mint::authority = marketplace,
    )]
    pub rewards_mint: InterfaceAccount<'info, Mint>,
    pub system_program: Program<'info, System>,
    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
}

impl<'info> Purchase<'info>{

    pub fn send_sol(&self) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();
        
        let cpi_accounts = Transfer {
            from: self.buyer.to_account_info(),
            to: self.maker.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        let amount = self.listing.price
            .checked_sub(self.marketplace.fee as u64).unwrap();

        transfer(cpi_ctx, self.listing.price - amount)?;

        Ok(())
    }

    pub fn send_nft(&mut self) -> Result<()> {

        let binding = self.maker_mint.key();
        let binding2 = self.marketplace.key();
        
        let signer_seeds: [&[&[u8]]; 1] = [&[
            binding2.as_ref(),
            binding.as_ref(),
            &[self.listing.bump],
        ]];

        TransferV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
            .asset(&self.maker_mint.to_account_info())
            .authority(Some(&self.listing.to_account_info()))
            .payer(&self.buyer.to_account_info())
            .new_owner(&self.buyer.to_account_info()) // authority back to the user/maker
            .collection(Some(&self.collection.to_account_info()))
            .system_program(Some(&self.system_program.to_account_info()))
            .invoke_signed(&signer_seeds)?;

        Ok(())
    }
}