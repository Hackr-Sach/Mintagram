from brownie import  Mint_Auction
from scripts.helpful_scripts import get_account

def deploy():
    account = get_account()
    Mint_Auction.deploy(
        "180",
        "0xFb65A9e3B18abcF21F926e1C213887369EbF75Fd",
        {"from": account},
        publish_source=True,
    )
def main():
    deploy()
    print('contrct deployed')