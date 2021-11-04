from brownie import accounts, config, Mint_A_Gram, network

def get_account():
    if network.show_active() == "development":
        return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key"])

def deploy():
    account = get_account()
    Mint_A_Gram.deploy({"from": account})

def main():
    deploy()
    print('contrct deployed')