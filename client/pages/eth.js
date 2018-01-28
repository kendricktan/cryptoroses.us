import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'
import { Image, Form, Segment, Button, TextArea, Input } from 'semantic-ui-react'

class RoseViaETH extends React.Component {
  state = { buying: false, buySuccess: false, buyRoseType: null, sendFrom: '', sendTo: '', sendMemo: '', readMemo: '', readRoseType: -1, readHasRose: false, readHash: '' }

  handleSelectedRoseChange = ({ roseType }) => this.setState({ buyRoseType: roseType })

  componentDidMount = () => {
    this.checkRose()
  }

  buyRose = () => {
    const { accounts, contract, web3 } = this.props
    const { sendMemo, sendFrom, sendTo, buyRoseType } = this.state

    if (accounts[0] === undefined) {
      alert('Unable to connect to web3, please unlock metamask or use the mist browser')
      return
    }

    const memo = JSON.stringify({
      memo: sendMemo,
      to: sendTo,
      from: sendFrom
    })
    const ethPrice = this.getRoseETH(buyRoseType)
    const hashRID = web3.utils.sha3(accounts[0])

    this.setState({
      buying: true
    })

    contract.buyRoseETH(memo, { from: accounts[0], to: contract.address, gasPrice: web3.utils.toWei('25', 'gwei'), value: web3.utils.toWei(ethPrice, 'ether') })
      .then((resp) => {
        this.setState({
          buying: false,
          readHasRose: true,
          readHash: hashRID
        })
      })
      .catch((err) => {
        this.setState({
          buying: false
        })
      })
  }

  checkRose = () => {
    const { accounts, contract, web3 } = this.props

    if (accounts[0] === undefined) {      
      return
    }

    const hashRID = web3.utils.sha3(accounts[0])

    contract.checkRose.call(hashRID, { from: accounts[0] })
      .then((resp) => {
        this.setState({
          readHasRose: resp[0],
          readRoseType: resp[1].c[0],
          readMemo: resp[2],
          readHash: hashRID
        })
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
    const { readHasRose, readRoseType, readMemo, readHash, buyRoseType, buying } = this.state
    const ethPrice = this.getRoseETH(buyRoseType)

    return (
      <div>
        {
          readHasRose ?
            (
              <div>
                <h2>Have fun with your new cryptorose :)</h2> <br />
                <b>Hash</b>: <a href={'/check?hash=' + readHash}>{readHash}</a>
              </div>
            ) :
            (
              <div>
                <h1>Purchase with ETH</h1><br/>

                {
                  buyRoseType === null ?
                    (
                      <div>
                        <h2>1. Choose your rose type</h2><br/>
                        <div style={{ textAlign: 'center' }}>
                          <Image.Group size='small'>
                            <Button
                              onClick={() => this.handleSelectedRoseChange({ roseType: 'gold' })}
                              basic color='yellow'>
                              <Image label='Gold (0.25 ETH)' fluid src='/static/gold_001.png' />
                            </Button>

                            <Button
                              onClick={() => this.handleSelectedRoseChange({ roseType: 'white' })}
                              basic color='black'>
                              <Image label='White (0.05 ETH)' fluid src='/static/white_001.png' />
                            </Button>

                            <Button
                              onClick={() => this.handleSelectedRoseChange({ roseType: 'pink' })}
                              basic color='pink'>
                              <Image label='Pink (0.02 ETH)' fluid src='/static/pink_002.png' />
                            </Button>

                            <Button
                              onClick={() => this.handleSelectedRoseChange({ roseType: 'red' })}
                              basic color='red'>
                              <Image label='Red (0.01 ETH)' fluid src='/static/red_001.png' />
                            </Button>
                          </Image.Group>
                        </div>
                      </div>
                    ) :
                    (
                      <div>
                        <h2>2. Enter your details.</h2>
                        <h4>(Please be patient, it takes a while to interact with the ETH blockchain)</h4><br/>
                        <Form>
                          <Form.Field>
                            <Input onChange={(e) => this.setState({ sendTo: e.target.value })} fluid icon='user' placeholder='To' />
                          </Form.Field>

                          <Form.Field>
                            <Input onChange={(e) => this.setState({ sendFrom: e.target.value })} fluid icon='send' placeholder='From' />
                          </Form.Field>                          

                          <Form.Field>
                            <TextArea placeholder='Memo: E.g. Lots of love' onChange={(e) => this.setState({ sendMemo: e.target.value })} />
                          </Form.Field>
                        </Form>

                        <br />
                        <Button
                          loading={buying}
                          onClick={this.buyRose}
                          fluid={true}
                          basic
                          color={buyRoseType === 'gold' ? 'yellow' : buyRoseType}>
                          Buy {buyRoseType} rose ({ethPrice} ETH)
                        </Button><br />
                        <Button
                          onClick={() => this.handleSelectedRoseChange({ roseType: null })}
                          fluid={true}
                          basic
                          color='black'>
                          Cancel
                        </Button>
                        <br />
                      </div>
                    )
                }
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
      renderLoading={() => <div>Loading cryptoroses dapp...</div>}
      render={({ accounts, contract, web3 }) => (
        <RoseViaETH web3={web3} accounts={accounts} contract={contract} />
      )}
    />
  </div>
)
