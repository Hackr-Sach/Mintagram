from brownie import Counter
from scripts.helpful_scripts import  get_account

def deploy():
    account = get_account()
    Counter.deploy('60', {"from": account}, publish_source=True)
    
def main():
    deploy()
    print('contrct deployed')