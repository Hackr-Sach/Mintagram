from brownie import ClockAuction
from scripts.helpful_scripts import  get_account

def deploy():
    account = get_account()
    ClockAuction.deploy(
        {"from": account}, 
        publish_source=True,
        )
    
def main():
    deploy()
    print('contract deployed')