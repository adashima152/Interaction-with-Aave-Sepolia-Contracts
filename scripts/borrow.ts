import { network } from "hardhat";
const { viem } = await network.connect({
  network: "sepolia",
  chainType: "l1",
});

import { parseUnits } from 'viem';
import CONTRACT_ABI from "../abi/Pool.json"; 

// --- Configuration ---
const ASSET_ADDRESS = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0" as const; //USDT
// const ASSET_ADDRESS = "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60" as const; //GHO
// const ASSET_ADDRESS = "0x29f2D40B0605204364af54EC677bD022dA425d03" as const; //WBTC
// const ASSET_ADDRESS = "0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5" as const; //LINK
// const ASSET_ADDRESS = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357" as const; //DAI
// const ASSET_ADDRESS = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8" as const; //USDC
// const ASSET_ADDRESS = "0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E" as const; //EURS

const POOL_PROXY_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951" as const;
const ON_BEHALF_OF_ADDRESS = "0xEd2B81376450d9dBB42Aa7274649AB20fF5060DA" as const; 
const REFERRAL_CODE = 0;
const ETH_AMOUNT_TO_BORROW = parseUnits("0.5", 6);
const INTEREST_RATE_MODE = BigInt(2)

async function main() {
    const publicClient = await viem.getPublicClient();
    
    const [walletClient] = await viem.getWalletClients(); 
    
    if (!walletClient || !walletClient.account) {
        throw new Error("Could not retrieve a signer account from Hardhat config.");
    }
    
    const account = walletClient.account;

    try {
        const hash = await walletClient.writeContract({
            address: POOL_PROXY_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'borrow',
            args: [
                ASSET_ADDRESS,
                ETH_AMOUNT_TO_BORROW,
                INTEREST_RATE_MODE,
                REFERRAL_CODE,
                ON_BEHALF_OF_ADDRESS
            ],
            account: account,
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === 'success') {
            console.log(`\n✅ Transaction confirmed successfully!`);
            console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
            console.log(`   Block Number: ${receipt.blockNumber.toString()}`);
        } else {
             console.log(`\n❌ Transaction failed. Receipt status: ${receipt.status}`);
        }

    } catch (error) {
        console.error("\n❌ Error:");
        console.error(error); 
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });