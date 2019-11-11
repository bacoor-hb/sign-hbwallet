# sign-hbwallet
[![npm version](https://badge.fury.io/js/sign-hbwallet.svg)](https://badge.fury.io/js/sign-hbwallet)

## Installation
```
npm install sign-hbwallet --save
```
or
```
yarn add sign-hbwallet
```

This project was created by [HB Wallet](https://www.hb-wallet.com/).

## Available Function

In the project directory, you can run:

### `onConnectWallet`

This will make a connect to Web3 Dapps in HBWallet .<br />
This will return a status as object like
 {
    status: WEB3_STATUS constant,
    network: NETWORK_ETHER constant,
    address: Address of connected account
  }

## Available Constant

### `NETWORK_ETHER`
  { key: 1, type: 'Mainnet' },
  { key: 2, type: 'Morden' },
  { key: 3, type: 'Ropsten' },
  { key: 4, type: 'Rinkeby' },
  { key: 42, type: 'Kovan' },
  { key: 5777, type: 'Private' }

### `WEB3_STATUS`
{
  Loading: 'loading',
  NoWeb3: 'noweb3',
  Error: 'error',
  Locked: 'locked',
  ChangeAccount: 'changeaccount',
  Ready: 'ready'
}

## Usage example

```javascript
import React from 'react'
import { onConnectWallet, NETWORK_ETHER } from 'sign-hbwallet'

class HomePage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      web3Wallet: {}
    }
  }

  async componentDidMount() {
    setInterval(() => {
      this.refreshWeb3()
    }, 1000)
  }

  refreshWeb3 = async () => {
    const { web3Wallet } = this.state
    const newWeb3Status = await onConnectWallet(web3Wallet)

    // Need to get signed in here
    if (((newWeb3Status && newWeb3Status.status) !== web3Wallet.status)) {
      this.setState({ web3Wallet: newWeb3Status })
    }
  }

  render() {
    const { web3Wallet } = this.state
    return (
      <div>
        <h1>{'HB Wallet'}</h1>
        <div>{'Your address: ' + ((web3Wallet && web3Wallet.account) ? web3Wallet.account : '...')}</div>
        <div>{'Your network: ' + ((web3Wallet && web3Wallet.network) ? NETWORK_ETHER.find(itm => itm.key === web3Wallet.network).type : '...')}</div>
      </div>
    )
  }
}
export default HomePage

```