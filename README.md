If your are using hardhat v3 for the first time. Using  `hardhat-keystore` to set your password, `SEPOLIA_PRIVATE_KEY`, and `SEPOLIA_RPC_URL`:
```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat keystore set SEPOLIA_RPC_URL
```

Run corresponding TypeScript file in `\scripts` folder with hardhat env to execute the action you want. For example, to supply ETH, firstly you should set the const var `ON_BEHALF_OF_ADDRESS` to the address you want to use. And set `ETH_AMOUNT_TO_DEPOSIT`. Then run the command:
```shell
npx hardhat run scripts/supply-eth.ts --network sepolia
```
