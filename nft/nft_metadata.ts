import wallet from "../../../Turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi(
  "https://yolo-dry-silence.solana-devnet.quiknode.pro/7a7c3810f80313da7bca8637ec638f2c1c70f213"
);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://devnet.irys.xyz/21h9V7tWoLEFrGcoHyRcMGJDSiwbViPV8grqb64vrL5a";

    const metadata = {
      name: "Professor Andre",
      symbol: "ANDRE",
      description: "Professor Andre",
      image: image,
      attributes: [
        {
          trait_type: "andre",
          value: "0/10",
        },
        {
          trait_type: "turbine",
          value: "10/10",
        },
      ],
      properties: {
        files: [
          {
            type: "image/jpg",
            uri: "?",
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
