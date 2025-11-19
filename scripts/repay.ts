import { network } from "hardhat";
const { viem } = await network.connect({
    network: "sepolia",
    chainType: "l1",
});

import { parseUnits } from 'viem';
import CONTRACT_ABI from "../abi/Pool.json";
import ASSET_ABI from "../abi/TestnetERC20.json"

// --- Configuration ---
const CONTRACT_ADDRESS = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951" as const;
const ASSET_ADDRESS = "0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5" as const;
const ON_BEHALF_OF_ADDRESS = "0xEd2B81376450d9dBB42Aa7274649AB20fF5060DA" as const;
const REFERRAL_CODE = 1;
const AMOUNT_TO_REPAY = parseUnits("0.01", 18);
const AMOUNT_TO_APPROVE = parseUnits("100", 18);
const INTEREST_RATE_MODE = BigInt(2)

async function main() {
    const publicClient = await viem.getPublicClient();

    const [walletClient] = await viem.getWalletClients();

    if (!walletClient || !walletClient.account) {
        throw new Error("Could not retrieve a signer account from Hardhat config.");
    }

    const account = walletClient.account;

    console.log(account.address)

    // const hash = await walletClient.writeContract({
    //     address: ASSET_ADDRESS,
    //     abi: ASSET_ABI,
    //     functionName: 'approve',
    //     args: [
    //         CONTRACT_ADDRESS,
    //         AMOUNT_TO_APPROVE,
    //     ],
    //     account: account,
    // });

    // const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // if (receipt.status === 'success') {
    //     console.log(true)
    // }

    try {
        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'repay',
            args: [
                ASSET_ADDRESS,
                AMOUNT_TO_REPAY,
                INTEREST_RATE_MODE,
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