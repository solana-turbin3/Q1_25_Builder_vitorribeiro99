use anchor_lang::prelude::*;
use mpl_core::{
    ID as CORE_PROGRAM_ID,
    accounts::{BaseAssetV1, BaseCollectionV1}, 
    instructions::{ RemovePluginV1CpiBuilder, UpdatePluginV1CpiBuilder}, 
    types::{ FreezeDelegate, Plugin, PluginType, UpdateAuthority}, 
};

#[derive(Accounts)]
pub struct Unstake<'info> {
    pub owner: Signer<'info>,

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        has_one = owner,
        constraint = asset.update_authority == UpdateAuthority::Collection(collection.key()),
    )]
    pub asset: Account<'info, BaseAssetV1>,

    #[account(
        mut,
    )]
    pub collection: Account<'info, BaseCollectionV1>,
    
    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: this will be checked by core
    pub core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Unstake<'info> {
    pub fn unstake(&mut self) -> Result<()> {

    // Unfreeze the asset
    UpdatePluginV1CpiBuilder::new(&self.core_program.to_account_info())
    .asset(&self.asset.to_account_info())
    .collection(Some(&self.collection.to_account_info()))
    .payer(&self.user.to_account_info())
    .system_program(&self.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
    .invoke()?;

    // Remove the FreezeDelegate Plugin
    RemovePluginV1CpiBuilder::new(&self.core_program)
    .asset(&self.asset.to_account_info())
    .collection(Some(&self.collection.to_account_info()))
    .payer(&self.user)
    .system_program(&self.system_program)
    .plugin_type(PluginType::FreezeDelegate)
    .invoke()?;

    
    Ok(())
}
}