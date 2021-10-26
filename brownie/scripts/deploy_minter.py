from brownie import accounts, config, UserImage, network

def get_account():
    if network.show_active() == "development":
        return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key"])

def deploy():
    account = get_account()
    user_image = UserImage.deploy({"from": account})
    original = user_image.mintImage("https://ipfs.moralis.io:2053/ipfs/QmUtDUs2xFvqkhM9S64eesaHjNntL22Jt38YKx111ym8dJ")
    print("#1 " + str(original))
    transaction = user_image.mintImage("https://ipfs.moralis.io:2053/ipfs/Qmek3VSvD3NTeGvfA1HAo4H4xgknvJn3zPzrkQQmrpKsww")
    transaction.wait(1)
    updated_transaction = transaction
    print("#2 " + str(updated_transaction))

def main():
    deploy()
    print('contrct deployed')