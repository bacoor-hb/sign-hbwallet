export const WEB3_STATUS = {
  Loading: 'loading',
  NoWeb3: 'noweb3',
  Error: 'error',
  Locked: 'locked',
  ChangeAccount: 'changeaccount',
  Ready: 'ready'
}

export const NETWORK_ETHER = [
  { key: 1, type: 'Mainnet' },
  { key: 2, type: 'Morden' },
  { key: 3, type: 'Ropsten' },
  { key: 4, type: 'Rinkeby' },
  { key: 42, type: 'Kovan' },
  { key: 5777, type: 'Private' }
]


function onEnableWallet() {
  return new Promise((resolve, reject) => {
    web3.currentProvider && web3.currentProvider.enable().then(function (accounts) {
      newStatus.status = WEB3_STATUS.Ready
      newStatus.network = network
      newStatus.account = accounts[0].toLowerCase()
      resolve(newStatus)
    }).catch(() => {
      newStatus.status = WEB3_STATUS.Error
      newStatus.network = network
      resolve(newStatus)
    })
  })
}

/*
----- Connect to active Wallet -----
----- Status return as object like -----
  {
    status: WEB3_STATUS constant,
    network: NETWORK_ETHER constant,
    address: Address of connected account
  }
------------------------------------------
*/
export function onConnectWallet(currentWallet) {
  return new Promise(async (resolve, reject) => {
    let newStatus = Object.assign({}, currentWallet)
    try {
      // Check current status of window.web3
      if (typeof window.web3 === 'undefined') {
        if (currentWallet.status === WEB3_STATUS.Loading) {
          newStatus.status = WEB3_STATUS.NoWeb3
          newStatus.network = 0
          resolve(newStatus)
        } else if (newStatus.status !== WEB3_STATUS.NoWeb3) {
          newStatus.status = WEB3_STATUS.Error
          newStatus.network = 0
          resolve(newStatus)
        }
      } else {
        const web3 = window.web3

        // Check current network ether
        let p1 = new Promise((resolve, reject) => {
          try {
            web3.version.getNetwork((err, network) => {
              if (err) return reject(err)
              return resolve(network)
            })
          } catch (e) {
            return reject(e)
          }
        })
        // Close p1 promise if over time
        let p2 = new Promise(function (resolve, reject) {
          setTimeout(() => {
            return reject(new Error('request timeout'))
          }, 450)
        })

        Promise.race([p1, p2]).then((networkCode) => {
          const networkParse = parseInt(networkCode)
          const findNetwork = NETWORK_ETHER.find(itm => itm.key === networkCode)

          let network = findNetwork ? findNetwork.key : 'Unknown'

          // Enable open metamask when closed
          web3.eth.getAccounts((err, accounts) => {
            if (accounts && newStatus.account && newStatus.account !== accounts[0]) {
              // Clear data and reload page when change new account in here
              newStatus.status = WEB3_STATUS.ChangeAccount
              newStatus.network = network
              window.location.reload(true)
              resolve(newStatus)
            }

            if (err) {
              newStatus.status = WEB3_STATUS.Error
              newStatus.network = network
              resolve(newStatus)
            } else {
              if (!accounts || accounts.length <= 0) {
                onEnableWallet()
                newStatus.status = WEB3_STATUS.Error
                newStatus.network = network
                resolve(newStatus)
              } else {
                newStatus.status = WEB3_STATUS.Ready
                newStatus.network = network
                newStatus.account = accounts[0].toLowerCase()
                resolve(newStatus)
              }
            }
          })
        }).catch(() => {
          newStatus.status = WEB3_STATUS.Locked
          newStatus.network = 0
          resolve(newStatus)
        })
      }
    } catch (e) {
      newStatus.status = WEB3_STATUS.Error
      newStatus.network = 0
      resolve(newStatus)
    }
  })
}
