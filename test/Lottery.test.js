const assert = require("assert");
const ganache = require("ganache-cli");
const { send } = require("process");
const Web3 = require("web3");
web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("Deploys a contract", async () => {
    assert.ok(lottery.options.address);
  });
  it("one account can enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.2", "ether"),
    });
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.equal(players[0], accounts[0]);
    assert.equal(players.length, 1);
  });
  it("multiple accounts can enter", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.2", "ether") });
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.2", "ether") });
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("0.2", "ether") });
    // Multiple lines here because it is possible that only one of the assert not working
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.equal(players[0], accounts[0]);
    assert.equal(players.length, 3);
    assert.equal(players[1], accounts[1]);
    assert.equal(players[2], accounts[2]);
  });

  it("minimum ether to enter is 0.1", async () => {
    try {
      await lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei("0.05", "ether") });
      assert(false); // if the above statements would not fail, we want to throw an error so the test does not pass so we would assert false to throw off our test
    } catch (err) {
      assert(err);
    }
    // The try catch method only work in async functions to catch if there is an error
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("sends money to the winner and ressets array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });
    const initalBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initalBalance;
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});
