use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    program::{ invoke},
    declare_id,
  };
  pub use spl_token::{ self };
  
  declare_id!("9JJ7YB57HeygUxPUojGSJxhBZhv61eWbomAEYFVg6dYE");
  entrypoint!(process_instruction);
  
  pub fn process_instruction(
  _program_id: &Pubkey,
  accounts: &[AccountInfo],
  _instruction_data: &[u8]
  ) -> ProgramResult {
  msg!("Beginning staking ...");
  
  // Get Account iterator
  let account_info_iter = &mut accounts.iter();
  
  // Get accounts
  let initializer = next_account_info(account_info_iter)?;
  let source_token_account = next_account_info(account_info_iter)?;
  let destination_token_account = next_account_info(account_info_iter)?;
  let token_program = next_account_info(account_info_iter)?;
  let amount = 1;
      
  let ix = spl_token::instruction::approve(
          token_program.key,
          source_token_account.key,
          destination_token_account.key,
          initializer.key,
          &[initializer.key],
          amount,
          )?;
              invoke(
                  &ix,
                  &[
              source_token_account.clone(),
              destination_token_account.clone(),
              initializer.clone(),
              token_program.clone(),
                  ],
              )?;
              msg!(
                  "approved tx"
              );
      
  let transfer_to_initializer_ix = spl_token::instruction::transfer(
          token_program.key,
          source_token_account.key,
          destination_token_account.key,
          initializer.key,
          &[initializer.key],
          amount,
      )?;
      msg!("Calling token program to transfer tokens");
      invoke(
          &transfer_to_initializer_ix,
          &[
              source_token_account.clone(),
              destination_token_account.clone(),
              initializer.clone(),
              token_program.clone(),
          ]
      )?;
      msg!("Token transfer done");
  Ok(())
  }