from brownie import Mint_Auction_Base
from scripts.helpful_scripts import  get_account

def deploy():
    account = get_account()
    Mint_Auction_Base.deploy(
        {"from": account}, 
        publish_source=True,
        )
    
def main():
    deploy()
    print('contract deployed')