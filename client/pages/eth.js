import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import { Image, Form, Segment, Button, TextArea, Input } from 'semantic-ui-react'

class RoseViaETH extends React.Component {
  state = { buyRoseType: 'white', sendFrom: '', sendTo: '', sendMemo: '', readMemo: '', readRoseType: -1, readHasRose: false, readHash: '' }

  handleSelectedRoseChange = (e, { value }) => this.setState({ buyRoseType: value })

  componentDidMount = () => {
    this.checkRose()
  }

  buyRose = async () => {
    const { accounts, contract, web3 } = this.props
    const { sendMemo, sendFrom, sendTo, buyRoseType } = this.state
    const memo = JSON.stringify({
      memo: sendMemo,
      to: sendTo,
      from: sendFrom
    })
    const ethPrice = this.getRoseETH(buyRoseType)

    await contract.buyRoseETH(memo, { from: accounts[0], to: contract.address, value: web3.utils.toWei(ethPrice, 'ether') })
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

  getRoseETH = (color) => {
    if (color === 'gold') return '0.25'
    else if (color === 'white') return '0.05'
    else if (color === 'pink') return '0.02'
    else if (color === 'red') return '0.01'
  }

  render() {
    const { contract, web3 } = this.props
    const { readHasRose, readRoseType, readMemo, readHash, buyRoseType } = this.state
    const ethPrice = this.getRoseETH(buyRoseType)

    return (
      <div>
        {
          readHasRose ?
            (
              <div>
                <h2 style={{ fontFamily: "'Open Sans', sans-serif", color: '#1e272e' }}>It appears you already bought a rose :)</h2> <br/>                
                <b>Hash</b>: <a href={'/check?hash=' + readHash}>{readHash}</a>
              </div>
            ) :
            (
              <div>
                <h2 style={{ fontFamily: "'Open Sans', sans-serif", color: '#1e272e' }}>Attach a message alongside your Rose</h2>

                {
                  buyRoseType === 'gold' ?
                    <Image src='//www.theforeverrose.com/media/dipped-roses/gold-rose-4.jpg' size='medium' centered /> :
                    buyRoseType === 'white' ?
                      <Image src='//www.doctorsja.com/wp-content/uploads/2013/06/small__2343714916.jpg' size='medium' centered /> :
                      buyRoseType === 'pink' ?
                        <Image src='//storiesthatmatter.files.wordpress.com/2014/10/pink-rose-1280x1024.jpg' size='medium' centered /> :
                        <Image src='//www.fullblossomflorist.com/wp-content/uploads/2016/02/0000350_single-red-rose-600x600.jpeg' size='medium' centered />
                } <br />

                <Form>
                  <Form.Group widths='equal' inline>
                    <Form.Radio
                      fluid
                      label='Gold Rose'
                      name='radioGroup'
                      value='gold'
                      checked={this.state.buyRoseType === 'gold'}
                      onChange={this.handleSelectedRoseChange}
                    />
                    <Form.Radio
                      fluid
                      label='White Rose'
                      name='radioGroup'
                      value='white'
                      checked={this.state.buyRoseType === 'white'}
                      onChange={this.handleSelectedRoseChange}
                    />
                    <Form.Radio
                      fluid
                      label='Pink Rose'
                      name='radioGroup'
                      value='pink'
                      checked={this.state.buyRoseType === 'pink'}
                      onChange={this.handleSelectedRoseChange}
                    />
                    <Form.Radio
                      fluid
                      label='Red Rose'
                      name='radioGroup'
                      value='red'
                      checked={this.state.buyRoseType === 'Red'}
                      onChange={this.handleSelectedRoseChange}
                    />
                  </Form.Group>

                  <Form.Field>
                    <Input onChange={(e) => this.setState({ sendFrom: e.target.value })} fluid icon='send' placeholder='Sender name' />
                  </Form.Field>

                  <Form.Field>
                    <Input onChange={(e) => this.setState({ sendTo: e.target.value })} fluid icon='user' placeholder='Recipient name' />
                  </Form.Field>

                  <Form.Field>
                    <TextArea placeholder='Memo: E.g. Lots of love' onChange={(e) => this.setState({ sendMemo: e.target.value })} />
                  </Form.Field>
                </Form>

                <br />
                <Button
                  onClick={this.buyRose}
                  fluid
                  basic
                  color={buyRoseType === 'gold' ? 'yellow' : buyRoseType}>
                  Buy {buyRoseType} rose ({ethPrice} ETH)
                </Button>
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
    <Web3Container
      renderLoading={() => <div>Loading Dapp Page...</div>}
      render={({ accounts, contract, web3 }) => (
        <RoseViaETH web3={web3} accounts={accounts} contract={contract} />
      )}
    />
  </div>
)
