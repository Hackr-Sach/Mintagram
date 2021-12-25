from brownie import Mint_A_Gram, network, config
from scripts.helpful_scripts import get_account, get_contract, fund_with_link


def deploy():
    account = get_account()
    Mint_A_Gram.deploy(
        "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9", #vrfcoord
        "0xa36085F69e2889c224210F603D836748e7dC0088", #linktoken
        "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4", #keyhash
        '100000000000000000',
        '10000000000000000',
        '240',
        {"from": account},
        publish_source=True,
    )

TICKET_FEE = 10000000000000000
INTERVAL = 240

def deploy_v2():
    # TODO: Refactor to use the get_contract and fund_with_link functions 
    # TODO: Refactor to grab settings from brownie-config.yaml
    account = get_account()
    mintagram = Mint_A_Gram.deploy(
        get_contract('vrf_coordinator'),
        get_contract('link_token'),
        config['networks'][network.show_active()]['keyhash'],
        config['networks'][network.show_active()]['fee'],
        TICKET_FEE,
        INTERVAL,
        {"from": account},
        publish_source=config['networks'][network.show_active()].get('verify', False)
    )
    fund_with_link(mintagram.address)
    return mintagram
    
    
def main():
    deploy()
    print('contrct deployed') 
