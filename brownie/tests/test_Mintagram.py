from brownie import Mint_A_Gram, accounts, web3
from scripts.helpful_scripts import get_account

# from scripts.deploy_mintagram import deploy
import pytest


@pytest.fixture(scope="module")
def mintagram(Mint_A_Gram, accounts):
    return accounts[0].deploy(Mint_A_Gram,
        "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
        "0xa36085F69e2889c224210F603D836748e7dC0088",
        "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
        '100000000000000000',
        '10000000000000000',
        '60'
    )

@pytest.fixture(autouse=True)
def shared_setup(fn_isolation):
    pass

def test_contract_ownership(mintagram, accounts):
    assert mintagram.owner() == accounts[0]

def test_mint_was_succesful(mintagram, accounts):
    mintagram.mintImage()
    mintagram.mintImage()
    assert mintagram.balanceOf(accounts[0], 2) == 1

def test_set_token_uri(mintagram):
    mintagram.setTokenURI(1, "test")

    assert mintagram.uri(1) == "test"

def test_enter_lottery(mintagram):
    mintagram.enterLottery()

    assert mintagram.getNumLotteryEntries() == 1