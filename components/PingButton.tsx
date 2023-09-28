import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, sendAndConfirmTransaction, SystemProgram } from '@solana/web3.js';
import * as web3 from '@solana/web3.js'
import { Transaction } from '@solana/web3.js';
import { FC, useState } from 'react'
import styles from '../styles/PingButton.module.css'

import { Signer } from '@solana/web3.js';

const PROGRAM_ID = `ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa`
const DATA_ACCOUNT_PUBKEY = `Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod`
// const [addr, setadd] = useState<string>('');

export const PingButton: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [addr, setadd] = useState<string>('');
  const [seckey, setseckey] = useState<string>('');

  const create = async () => {
    try {
      const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
      const keyPair = Keypair.generate();
      console.log(`New wallet address: ${keyPair.publicKey.toBase58()}`);
      setadd(keyPair.publicKey.toBase58());
      setseckey(keyPair.secretKey.toString());
      
    //   setadd(keyPair.publicKey.toBase58());	  
    } catch (error) {
      console.error(`Airdrop failed: ${error}`);
    }
  }


    const airdrop = async () => {
        try {
            const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
            const airdropSignature = await connection.requestAirdrop(
                new PublicKey(addr),
                LAMPORTS_PER_SOL * 2,
            );
            await connection.confirmTransaction(airdropSignature);
            console.log(`Airdropped 2 SOL to ${addr}`);
        } catch (error) {
            console.error(`Airdrop failed: ${error}`);
        }
    };


  const transfer = async () => {
      const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
      const from = new PublicKey(addr);
      const to = new PublicKey('7Qe8ovnWxZhdDRGKnoTiuhRFofd6aAjmyDRTR1xE7po9');
      const amount = web3.LAMPORTS_PER_SOL;
      const transaction = new Transaction().add(
          SystemProgram.transfer({
              fromPubkey: from,
              toPubkey: to,
              lamports: amount,
          })
      );
      const signers: Signer[] = [
          {
              publicKey: from,
              secretKey: Uint8Array.from(JSON.parse(`[${seckey}]`)),
          },
      ];
      await sendAndConfirmTransaction(connection, transaction, signers);
      console.log("success")
    
      const balance = await connection.getBalance(new PublicKey('7Qe8ovnWxZhdDRGKnoTiuhRFofd6aAjmyDRTR1xE7po9'));
      console.log(`Balance of 7Qe8ovnWxZhdDRGKnoTiuhRFofd6aAjmyDRTR1xE7po9: ${balance}`);
  }

  

  return (
    <div className={styles.buttonContainer}>
      <button className={styles.button} onClick={create}>create</button>
      <button className={styles.button} onClick={airdrop}>airdrop</button>
      <button className={styles.button} onClick={transfer}>transfer!</button>
    </div>
  )
}