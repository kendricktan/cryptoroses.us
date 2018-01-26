import axios from 'axios'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Label, Image, Button, Form, Input, TextArea } from 'semantic-ui-react'

class RoseViaGRLC extends React.Component {
  state = { buyingRose: false, buyRoseSuccess: false, buyRoseFailureReason: '', buyRoseFailed: false, buyRoseType: 'white', txid: '', memo: '', from: '', to: '', hash: '' }

  handleSelectedRoseChange = (e, { value }) => this.setState({ buyRoseType: value })

  getRoseGRLC = (color) => {
    if (color === 'gold') return '50'
    else if (color === 'white') return '10'
    else if (color === 'pink') return '4'
    else if (color === 'red') return '2'
  }

  buyRosesViaGRLC = async () => {
    const { txid, memo, from, to } = this.state
    const gMemo = JSON.stringify({ from, memo, to })

    this.setState({ buyingRose: true })

    axios.post('http://localhost:3001/buyrosegrlc', {
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
    const { buyRoseType, buyingRose, buyRoseSuccess, buyRoseFailed, buyRoseFailureReason, hash } = this.state
    const buyGRLCPrice = this.getRoseGRLC(buyRoseType)

    return (
      buyRoseSuccess ?
        (
          <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
            <h2>Purchase successful!</h2>
            <h4>Bookmark link below to view your cryptorose.</h4>
            <b>Hash</b>: <a href={'/check?hash=' + hash}>{hash}</a>
          </div>
        ) :
        (
          <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
            <Form>
              <Form.Field>
                <h2>Instructions to puchase with GRLC</h2>
              </Form.Field>

              <Form.Field>
                <h4>1. Choose what kind of rose you want to purchase</h4>
              </Form.Field>

              {
                buyRoseType === 'gold' ?
                  <Image src='//www.theforeverrose.com/media/dipped-roses/gold-rose-4.jpg' size='medium' centered /> :
                  buyRoseType === 'white' ?
                    <Image src='//www.doctorsja.com/wp-content/uploads/2013/06/small__2343714916.jpg' size='medium' centered /> :
                    buyRoseType === 'pink' ?
                      <Image src='//storiesthatmatter.files.wordpress.com/2014/10/pink-rose-1280x1024.jpg' size='medium' centered /> :
                      <Image src='//www.fullblossomflorist.com/wp-content/uploads/2016/02/0000350_single-red-rose-600x600.jpeg' size='medium' centered />
              } <br />

              <Form.Group widths='equal' inline>
                <Form.Radio
                  fluid='true'
                  label='Gold Rose'
                  name='radioGroup'
                  value='gold'
                  checked={this.state.buyRoseType === 'gold'}
                  onChange={this.handleSelectedRoseChange}
                />
                <Form.Radio
                  fluid='true'
                  label='White Rose'
                  name='radioGroup'
                  value='white'
                  checked={this.state.buyRoseType === 'white'}
                  onChange={this.handleSelectedRoseChange}
                />
                <Form.Radio
                  fluid='true'
                  label='Pink Rose'
                  name='radioGroup'
                  value='pink'
                  checked={this.state.buyRoseType === 'pink'}
                  onChange={this.handleSelectedRoseChange}
                />
                <Form.Radio
                  fluid='true'
                  label='Red Rose'
                  name='radioGroup'
                  value='red'
                  checked={this.state.buyRoseType === 'Red'}
                  onChange={this.handleSelectedRoseChange}
                />
              </Form.Group>

              <Form.Field>
                <h4>2. Send <i>{this.getRoseGRLC(buyRoseType)} GRLC</i> to the address <b>`GccDBuPbGfqH9MrkudhY3AriwiP2rVeUEH`</b></h4>
              </Form.Field>

              <Form.Field>
                <h4>3. Paste the txid into the field below</h4>
              </Form.Field>

              <Form.Field>
                <Input onChange={(e) => this.setState({ txid: e.target.value })} fluid icon='ticket' placeholder='Transaction ID' />
                {
                  buyRoseFailed ?
                  <Label basic color='red' pointing>{buyRoseFailureReason}</Label>:
                  null
                }                
              </Form.Field>

              <Form.Field>
                <h4>4. Fill out the rest of the info below</h4>
              </Form.Field>

              <Form.Field>
                <Input onChange={(e) => this.setState({ to: e.target.value })} fluid icon='send' placeholder='Sender name' />
              </Form.Field>

              <Form.Field>
                <Input onChange={(e) => this.setState({ from: e.target.value })} fluid icon='user' placeholder='Recipient name' />
              </Form.Field>

              <Form.Field>
                <TextArea placeholder='Memo: E.g. Lots of love' onChange={(e) => this.setState({ memo: e.target.value })} />
              </Form.Field>
            </Form>

            <br />

            <Button
              loading={buyingRose}
              onClick={this.buyRosesViaGRLC}
              fluid
              basic
              color={buyRoseType === 'gold' ? 'yellow' : buyRoseType}>
              Buy {buyRoseType} rose ({buyGRLCPrice} GRLC)
            </Button>
          </div>
        )
    )
  }
}

export default () => (
  <div>
    <RoseViaGRLC />
  </div>
)