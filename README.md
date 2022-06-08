# 📝 Smart_contract_lottery

This project is an ongoing experiment where I learn to write and deploy smart contracts to the test Rinkeby Eth Network. To start, a relatively "easy" use case have been decided : a lottery smart contract where anyone can enter with at least 0.1 ETH and only the manager of the lottery can pick the winner "randomly". Right now the randomness of the pickWinner function is not truely random but rather sudo random. This is not very secure and this will be addressed later on in the project.

# ✅ What has been done

- So far, a simple lottery smart contract has been coded in solidity language. You can find it [here](https://github.com/bidouze/Smart_contract_lottery/blob/master/contracts/Lottery.sol).
- I wrote some tests to make sure that the smart contrat works as intended. To run the test we use mocha. You can view these [here](https://github.com/bidouze/Smart_contract_lottery/blob/master/test/Lottery.test.js)

# ⏭️ What's next ?

We are planning to build an interactive front end webapp to make this trial project as complete as possible. This front end coded in Javascript React is going to be interacting with the smart contract in the backend. This is only going to be deployed in the test Rinkeby ETH Network.
