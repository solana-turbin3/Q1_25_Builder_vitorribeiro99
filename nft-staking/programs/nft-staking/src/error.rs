use anchor_lang::error_code;

#[error_code]
pub enum StakeError{
    #[msg("Max Stake Reached")]
    MaxStakeReached,
}