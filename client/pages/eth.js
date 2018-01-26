import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'

class RoseViaETH extends React.Component {
  state = { sendMemo: '', readMemo: '', readRoseType: -1, readHasRose: false, readHash: '' }

  componentDidMount = () => {
    this.checkRose()
  }

  buyRose = (a) => async () => {
    const { accounts, contract, web3 } = this.props
    const { sendMemo } = this.state
    await contract.buyRoseETH(sendMemo, { from: accounts[0], to: contract.address, value: web3.utils.toWei(a, 'ether') })
  }

  checkRose = async () => {
    const { accounts, contract, web3 } = this.props
    const hashRID = web3.utils.sha3(accounts[0])

    const response = await contract.checkRose.call(hashRID, { from: accounts[0] })

    this.setState({
      readHasRose: response[0],
      readRoseType: response[1].c[0],
      readMemo: response[2],
      readHash: hashRID
    })
  }

  render() {
    const { contract, web3 } = this.props
    const { readHasRose, readRoseType, readMemo, readHash } = this.state

    return (
      <div>
        {
          readHasRose ?
            (
              <div>
                <h1>Rose Status</h1>
                You've already bought a rose<br />
                Hash: {readHash}
              </div>
            ) :
            (
              <div>
                <h1>Buy roses</h1>

                Memo: <input type="text" onChange={(e) => this.setState({ sendMemo: e.target.value })} /> <br />

                <button onClick={this.buyRose('0.25')}>Buy Gold</button> &nbsp;
                <button onClick={this.buyRose('0.05')}>Buy White</button> &nbsp;
                <button onClick={this.buyRose('0.02')}>Buy Pink</button> &nbsp;
                <button onClick={this.buyRose('0.01')}>Buy Red</button>

                <br />
                <button onClick={this.checkRose}>Check Rose Status</button>
                <br />
              </div>
            )
        }
      </div>
    )
  }
}

export default () => (
  <div>
    <Head>
      <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css' />
    </Head>
    <Web3Container
      renderLoading={() => <div>Loading Dapp Page...</div>}
      render={({ accounts, contract, web3 }) => (
        <RoseViaETH web3={web3} accounts={accounts} contract={contract} />
      )}
    />
  </div>
)
