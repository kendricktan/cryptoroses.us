import axios from 'axios'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

class RoseViaGRLC extends React.Component {
  state = { txid: '', memo: '', from: '', to: '' }

  buyRosesViaGRLC = async () => {
    const { txid, memo, from, to } = this.state
    const gMemo = JSON.stringify({ from, memo, to })

    axios.post('http://localhost:3001/buyrosegrlc', {
      memo: gMemo,
      txid
    })
      .then((resp) => {
        console.log(resp)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render() {
    return (
      <div>
        <h3>Puchase with GRLC</h3>
        <p>
          1. Send your GRLC to `GccDBuPbGfqH9MrkudhY3AriwiP2rVeUEH`<br />
          - 50 GRLC for a Gold Rose<br />
          - 10 GRLC for a White Rose<br />
          - 4 GRLC for a Pink Rose<br />
          - 2 GRLC for a Red Rose<br />
          2. Paste txid into textbox, enter your details and send it
        </p>
        txid: <input type='text' onChange={(e) => this.setState({ txid: e.target.value })} /> <br />
        to: <input type='text' onChange={(e) => this.setState({ to: e.target.value })} /> <br />
        from: <input type='text' onChange={(e) => this.setState({ from: e.target.value })} /> <br />
        memo: <input type='text' onChange={(e) => this.setState({ memo: e.target.value })} /> <br />

        <button onClick={this.buyRosesViaGRLC}>Buy </button>
      </div>
    )
  }
}

export default () => (
  <div>
    <RoseViaGRLC />
  </div>
)