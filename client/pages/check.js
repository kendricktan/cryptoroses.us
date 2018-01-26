import axios from 'axios'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'


class CheckRose extends React.Component {
  state = { from: '', memo: '', to: '', roseType: -1, hasRose: false, hash: '', checkedHash: '' }

  componentDidMount = () => {
    const { hash } = this.props

    this.setState({
      hash
    }, this.checkRose)
  }

  checkRose = async () => {
    const { hash } = this.state
    const response = await axios.post('http://localhost:3001/checkhash', { hash })
    const data = response.data

    if (data[0] === false) {
      this.setState({
        checkedHash: hash
      })
      return
    }

    const memoJson = JSON.parse(data[2])    

    this.setState({
      hasRose: data[0],
      roseType: data[1],
      memo: memoJson.memo,
      from: memoJson.from,
      to: memoJson.to,
      checkedHash: hash
    })
  }

  render() {
    const { hasRose, roseType, memo, from, to, hash, checkedHash } = this.state

    return (
      <div>
        {
          hasRose ?
            (
              <div>
                <h1>Rose Status</h1>
                You have rose type: {roseType} <br/>
                from: {from}<br/>
                to: {to}<br/>
                memo: {memo}
              </div>
            ) :
            (
              <div>
                <h2>Rose not found for hash { checkedHash }, <br/> please double check the hash</h2>
                hash: <input type='text' onChange={(e) => this.setState({ hash: e.target.value })} value={hash} />
                <button onClick={this.checkRose}>Check</button>
              </div>
            )
        }
      </div>
    )
  }
}


export default ({ url: { query: { hash } } }) => (
  <div>
    <Head>
      <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css' />
    </Head>
    <CheckRose hash={hash} />
  </div>
)
