import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Menu, Segment } from 'semantic-ui-react'
import Web3Container from '../lib/Web3Container'

class RoseMenu extends React.Component {
  state = { activeItem: 'ETH' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Menu fluid widths={2}>
          <Menu.Item name='ETH' active={activeItem === 'ETH'} onClick={this.handleItemClick} />
          <Menu.Item name='GRLC' active={activeItem === 'GRLC'} onClick={this.handleItemClick} />
        </Menu>

        <Segment>
          {
            activeItem == 'ETH' ?
            <RoseViaETH {...this.props}/> : <RoseViaGRLC {...this.props} />
          }
        </Segment>
      </div>
    )
  }
}

class RoseViaGRLC extends React.Component {
  state = { txid: '', memo: '', from: '', to: '' }
  
  render() {
    return (
      <div>
        <h3>Puchase with GRLC</h3>
        <p>
          1. Send your GRLC to `GccDBuPbGfqH9MrkudhY3AriwiP2rVeUEH`<br/>
              - 50 GRLC for a Gold Rose<br/>
              - 10 GRLC for a White Rose<br/>
              - 4 GRLC for a Pink Rose<br/>
              - 2 GRLC for a Red Rose<br/>
          2. Paste txid into textbox, enter your details and send it          
        </p>
        txid: <input type='text' onChange={(e) => this.setState({ txid: e.target.value })} /> <br/>
        to: <input type='text' onChange={(e) => this.setState({ to: e.target.value })} /> <br/>
        from: <input type='text' onChange={(e) => this.setState({ from: e.target.value })} /> <br/>
        memo: <input type='text' onChange={(e) => this.setState({ memo: e.target.value })} /> <br/>
      </div>
    )
  }
}


class RoseViaETH extends React.Component {
  state = { sendMemo: '', readMemo: '', readRoseType: -1, readHasRose: false, readHash: '' }

  componentDidMount = () => {
    this.checkRose()
  }

  buyRose = (a) => async () => {
    // TODO Call the express server
    const { accounts, contract, web3 } = this.props
    const { sendMemo } = this.state
    await contract.buyRoseETH(sendMemo, { from: accounts[0], to: contract.address, value: web3.utils.toWei(a, 'ether') })
  }

  checkRose = async () => {
    // TODO: Call the express server
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
                You have a rose of type: {readRoseType}<br />
                Memo: {readMemo}<br />
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
        <RoseMenu web3={web3} accounts={accounts} contract={contract} />
      )}
    />
  </div>
)
