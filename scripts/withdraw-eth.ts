import { network } from "hardhat";
const { viem } = await network.connect({
  network: "sepolia",
  chainType: "l1",
});

import { parseEther } from 'viem';
import CONTRACT_ABI from "../abi/WrappedTokenGatewayV3.json"; 

// --- Configuration ---
const CONTRACT_ADDRESS = "0xfA0e305E0f46AB04f00ae6b5f4560d61a2183E00" as const;
const PLACEHOLDER_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
const ON_BEHALF_OF_ADDRESS = "0xEd2B81376450d9dBB42Aa7274649AB20fF5060DA" as const; 
const REFERRAL_CODE = 0;
const ETH_AMOUNT_TO_WITHDRAW = parseEther("0.001");

async function main() {
    const publicClient = await viem.getPublicClient();
    
    const [walletClient] = await viem.getWalletClients(); 
    
    if (!walletClient || !walletClient.account) {
        throw new Error("Could not retrieve a signer account from Hardhat config.");
    }
    
    const account = walletClient.account;

    try {
        const hash = await walletClient.writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'withdrawETH',
            args: [
                PLACEHOLDER_ADDRESS,
                ETH_AMOUNT_TO_WITHDRAW,
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