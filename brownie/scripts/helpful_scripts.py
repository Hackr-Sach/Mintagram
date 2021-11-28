from brownie import network, accounts, config

NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS = [
    "hardhat",
    "development",
    "ganache",
    "hardhat-saved",
]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS + [
    "mainnet-fork",
    "binance-fork",
    "matic-fork",
]


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])

# def fund_with_link(
#     contract_address, account=None, link_token=None, amount=1000000000000000000
# ):
#     account = account if account else get_account()
#     link_token = link_token if link_token else get_contract("link_token")
#     tx = link_token.transfer(contract_address, amount, {"from": account})
#     print(f"Funded {contract_address} with LINK")
#     return tx