
import styles from '../styles/Home.module.css'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {  Button } from '@chakra-ui/react'
import * as web3 from '@solana/web3.js'
import * as token from "@solana/spl-token"
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const STAKING_PROGRAM_ID = '9JJ7YB57HeygUxPUojGSJxhBZhv61eWbomAEYFVg6dYE'
const TOKEN_MINT_ADDRESS = '2QK4vnVcUDSBiq7Ft5BSp8N3QUMfqxkzX13gecRbtSh8';

const Home: NextPage = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const stakingProgram = new web3.PublicKey(STAKING_PROGRAM_ID);

    async function handleSubmit(event: any) {
        event.preventDefault()
        if (!publicKey) {
            alert('Please connect your wallet!')
            return
        }

        const transaction = new web3.Transaction()
        console.log('Mint address', TOKEN_MINT_ADDRESS)
        const mint = new web3.PublicKey(TOKEN_MINT_ADDRESS);

            const userAta = await token.getAssociatedTokenAddress(
                mint,
                publicKey
            )
            const stakingProgramAssociatedTokenAccount = await token.getAssociatedTokenAddress(
                mint,
                stakingProgram
            )

            console.log('userAta', userAta.toString())
            console.log('stakingProgramAssociatedTokenAccount', stakingProgramAssociatedTokenAccount.toString())

        // add staking instruction
        const instruction = new web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    is_signer: true,
                    is_writable: true,
                    pubkey: userAta,
                },
                {
                    is_signer: true,
                    is_writable: true,
                    pubkey: stakingProgramAssociatedTokenAccount,
                },
                {
                    is_signer: false,
                    is_writable: false,
                    pubkey: token.TOKEN_PROGRAM_ID,
                },
            ],
            programId: stakingProgram
        })

        console.log('adding staking instruction')
        transaction.add(instruction)

        try {
            const txid = await sendTransaction(transaction, connection);

            alert(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }
    }
    
  return (
    <div className={styles.App}>
      <div className={styles.AppHeader}>
            <WalletMultiButton />
      </div>          
      <Button onClick={handleSubmit} mt={4} type="submit">
          Begin Staking
      </Button>
    </div>
  )
}

export default Home
