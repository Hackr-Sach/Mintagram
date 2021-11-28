from brownie import  StandardAuction
from scripts.helpful_scripts import get_account

def deploy():
    account = get_account()
    StandardAuction.deploy(
        1200, #network fee 1200/10000 * salePrice
        "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", #vrfcoord
        "0xa36085F69e2889c224210F603D836748e7dC0088", #linktoken
        "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4", #keyhash
        '100000000000000000',
        {"from": account},
        publish_source=True,
    )
def main():
    deploy()
    print('contrct deployed')