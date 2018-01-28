import axios from 'axios'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Label, Image, Button, Form, Input, TextArea } from 'semantic-ui-react'

class RoseViaGRLC extends React.Component {
  state = {
    checkedTxid: false,
    checkingTxid: false,  
    buyingRose: false,
    buyRoseSuccess: false,
    buyRoseFailureReason: '',
    buyRoseFailed: false,
    buyRoseType: null,
    txid: '', memo: '', from: '', to: '', hash: ''
  }

  handleSelectedRoseChange = ({ roseType }) => this.setState({ buyRoseType: roseType })

  getRoseGRLC = (color) => {
    if (color === 'gold') return '50'
    else if (color === 'white') return '10'
    else if (color === 'pink') return '4'
    else if (color === 'red') return '2'    
  }

  checkGRLCTxid = () => {    
    const { txid, buyRoseType } = this.state
    const buyGRLCPrice = parseFloat(this.getRoseGRLC(buyRoseType))
    const url = 'https://explorer.grlc-bakery.fun/api/getrawtransaction?txid=' + txid + '&decrypt=1'

    this.setState({
      checkingTxid: true,
      buyRoseFailed: false
    })

    axios.get(url)
      .then((resp) => {
        const data = resp.data

        if (data.vout === undefined) {
          this.setState({
            buyRoseFailed: true,
            checkingTxid: false,
            buyRoseFailureReason: 'Invalid txid'
          })
          return
        }

        // Check VOUT and count how much is sent to the address
        const sendAmount = data.vout.reduce((total, vout) => {
          try {
            if (vout.scriptPubKey.addresses[0] === 'GccDBuPbGfqH9MrkudhY3AriwiP2rVeUEH') {
              return total + parseFloat(vout.value)
            }
          } catch (e) {
            return total
          }
          return total
        }, 0.0)

        if (sendAmount < buyGRLCPrice) {
          this.setState({
            buyRoseFailed: true,
            checkingTxid: false,            
            buyRoseFailureReason: 'Insufficient GRLC sent. Expected: ' + buyGRLCPrice + ', received: ' + sendAmount
          })
          return;
        }

        this.setState({
          buyRoseFailed: false,
          checkingTxid: false,
          checkedTxid: true
        })
      })
      .catch((err) => {        
        this.setState({
          buyRoseFailed: true,
          checkingTxid: false,
          buyRoseFailureReason: 'Explorer seems to be down, please try again later'
        })
      })
  }

  buyRosesViaGRLC = async () => {
    const { txid, memo, from, to } = this.state
    const gMemo = JSON.stringify({ from, memo, to })

    this.setState({ buyingRose: true })

    axios.post('//oracle.cryptoroses.us/buyrosegrlc', {
      memo: gMemo,
      txid
    })
      .then((resp) => {
        this.setState({
          hash: resp.data.hash,
          buyingRose: false,
          buyRoseSuccess: true,
          buyRoseFailed: false,
        })
      })
      .catch((err) => {
        const errCode = err.response.status
        const errMsg = (errCode === 402) ? 'Insufficient payment / invalid txid' : 'Garlicoin explorer seems to be down, please try again later'
        this.setState({
          buyingRose: false,
          buyRoseSuccess: false,
          buyRoseFailed: true,
          buyRoseFailureReason: errMsg
        })
      })
  }

  render() {
    const { checkingTxid, buyRoseType, buyingRose, buyRoseSuccess, buyRoseFailed, buyRoseFailureReason, checkedTxid, hash, to, from, memo } = this.state
    const buyGRLCPrice = this.getRoseGRLC(buyRoseType)

    return (
      buyRoseSuccess ?
        (
          <div>
            <h2>Purchase successful!</h2>
            <h4>Bookmark link below to view your cryptorose.</h4>
            <b>Hash</b>: <a href={'/check?hash=' + hash}>{hash}</a>
          </div>
        ) :
        (
          <div>
            <h1>Puchase with GRLC</h1><br/>

            {
              buyRoseType === null ?
                (
                  <div>
                    <h2>1. Choose your rose kind</h2><br/>

                    <div style={{ textAlign: 'center' }}>
                      <Image.Group size='small'>
                        <Button
                          onClick={() => this.handleSelectedRoseChange({ roseType: 'gold' })}
                          basic color='yellow'>
                          <Image label='Gold (50 GRLC)' fluid src='/static/gold_001.png' />
                        </Button>

                        <Button
                          onClick={() => this.handleSelectedRoseChange({ roseType: 'white' })}
                          basic color='black'>
                          <Image label='White (10 GRLC)' fluid src='/static/white_001.png' />
                        </Button>

                        <Button
                          onClick={() => this.handleSelectedRoseChange({ roseType: 'pink' })}
                          basic color='pink'>
                          <Image label='Pink (4 GRLC)' fluid src='/static/pink_002.png' />
                        </Button>

                        <Button
                          onClick={() => this.handleSelectedRoseChange({ roseType: 'red' })}
                          basic color='red'>
                          <Image label='Red (2 GRLC)' fluid src='/static/red_001.png' />
                        </Button>
                      </Image.Group>
                    </div>
                  </div>
                ) :
                checkedTxid === false ?
                  (
                    <div>
                      <Form>
                        <Form.Field>
                          <h2>2. Send <i>{this.getRoseGRLC(buyRoseType)} GRLC</i> to the address <b>`GccDBuPbGfqH9MrkudhY3AriwiP2rVeUEH`</b></h2>
                        </Form.Field>

                        <br/>

                        <Form.Field>
                          <h2>3. Paste the txid into the field below</h2>
                        </Form.Field>

                        <Form.Field>
                          <Input onChange={(e) => this.setState({ txid: e.target.value })} fluid icon='ticket' placeholder='Transaction ID' />
                          {
                            buyRoseFailed ?
                              <Label basic color='red' pointing>{buyRoseFailureReason}</Label> :
                              null
                          }
                        </Form.Field>

                        <Form.Field>
                          <Button
                            loading={checkingTxid}
                            onClick={this.checkGRLCTxid}
                            basic fluid color={buyRoseType === 'gold' ? 'yellow' : buyRoseType}>Next</Button>
                        </Form.Field>

                        <Form.Field>
                          <Button fluid basic color='black'
                            onClick={() => {
                              this.setState({
                                buyRoseType: null,
                                checkedTxid: false
                              })
                            }}>Cancel</Button>
                        </Form.Field>
                      </Form>
                    </div>
                  ) :
                  (
                    <div>
                      <Form>
                        <Form.Field>
                          <h2>4. Fill out the rest of the info below</h2>
                          <h4>(Please be patient, it takes a while to interact with the ETH blockchain)</h4><br/>
                        </Form.Field>

                        <Form.Field>
                          <Input onChange={(e) => this.setState({ to: e.target.value })} value={to} fluid icon='send' placeholder='To' />
                        </Form.Field>

                        <Form.Field>
                          <Input onChange={(e) => this.setState({ from: e.target.value })} value={from} fluid icon='user' placeholder='From' />
                        </Form.Field>

                        <Form.Field>
                          <TextArea placeholder='Memo: E.g. Lots of love' vlaue={memo} onChange={(e) => this.setState({ memo: e.target.value })} />
                        </Form.Field>
                      </Form>

                      <br />

                      <Button
                        loading={buyingRose}
                        onClick={this.buyRosesViaGRLC}
                        fluid
                        basic
                        color={buyRoseType === 'gold' ? 'yellow' : buyRoseType}>
                        Claim my {buyRoseType} rose! ({buyGRLCPrice} GRLC)
                      </Button><br/>
                      <Button fluid basic color='black'
                        onClick={() => {
                          this.setState({
                            buyRoseType: null,
                            checkedTxid: false
                          })
                        }}>Cancel</Button>
                    </div>
                  )
            }



          </div>
        )
    )
  }
}

export default () => (
  <RoseViaGRLC />
)