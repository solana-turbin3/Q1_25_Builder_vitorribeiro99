import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../../../Turbin3-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT =
  "https://yolo-dry-silence.solana-devnet.quiknode.pro/7a7c3810f80313da7bca8637ec638f2c1c70f213";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  let tx = createNft(umi, {
    mint,
    name: "Professor Andre - The Ruger",
    symbol: "ANDRE",
    uri: "https://devnet.irys.xyz/BZbRopJ9iXZ2XRDC1SZ7TZU1Z6juKPZzPmXWuTcga3Fp",
    sellerFeeBasisPoints: percentAmount(1),
  });

  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  console.log("Mint Address: ", mint.publicKey);
})();
