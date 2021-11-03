from brownie import accounts, config, UserImage, network

def get_account():
    if network.show_active() == "development":
        return accounts[0]
    else:
        return accounts.add(config["wallets"]["from_key"])

def deploy():
    account = get_account()
    user_image = UserImage.deploy({"from": account})
    #original = user_image.mintImage("https://ipfs.moralis.io:2053/ipfs/QmUY2q3wkeJqVem5q4HSWvGB2snYUeL6z6Pku9Mjzq9X2u/metadata/1.png.json")
    print("[[TEST]] " + str(user_image))
  

def main():
    deploy()
    print('contrct deployed')