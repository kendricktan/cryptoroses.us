import axios from 'axios'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { initGA, logPageView } from './ga.js'
import { Grid, Image } from 'semantic-ui-react'


class CheckRose extends React.Component {
  state = { from: '', memo: '', to: '', roseType: -1, hasRose: false, hash: '', checkedHash: false }

  componentDidMount = () => {    
    initGA()
    logPageView()

    const { hash } = this.props

    this.setState({
      hash
    }, this.checkRose)
  }

  getRosePic = (t) => {

    if (t === '0') return '/static/gold_001.png'
    else if (t === '1') return '/static/white_003.png'
    else if (t === '2') return '/static/pink_002.png'
    else if (t === '3') return '/static/red_001.png'
  }

  checkRose = async () => {
    const { hash } = this.state
    const response = await axios.post('//oracle.cryptoroses.us/checkhash', { hash })
    const data = response.data

    if (data[0] === false) {
      this.setState({
        checkedHash: true
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
      checkedHash: true
    })
  }

  render() {
    const { hasRose, roseType, memo, from, to, hash, checkedHash } = this.state

    return (
      <div style={{ height: '100vh' }}>
        <Grid style={{ height: '100%' }}>
          <Grid.Row>
            <Grid.Column width={3}>
            </Grid.Column>
            <Grid.Column width={10} style={{ textAlign: 'center' }}>
              {
                !checkedHash ?
                  (
                    <div style={{ height: '100%', display: 'grid' }}>
                      <div style={{ margin: 'auto' }}>
                        <h2>Checking hash ...</h2>
                      </div>
                    </div>
                  ) :
                  hasRose ?
                    (
                      <div style={{ height: '100%' }}>
                        <div style={{ height: '20%', display: 'grid' }}>
                          <div style={{ margin: 'auto' }}>
                            <h1>to: {to}</h1>
                          </div>
                        </div>

                        <div style={{ height: '60%', display: 'grid', backgroundColor: '#E4F1FE' }}>
                          <div style={{ margin: 'auto' }}>
                            <div><Image src={this.getRosePic(roseType)} size='small' centered /></div>
                            <h3>{memo}</h3>
                          </div>
                        </div>

                        <div style={{ height: '20%', display: 'grid' }}>
                          <div style={{ margin: 'auto' }}>
                            <h1>from: {from}</h1>
                          </div>
                        </div>
                      </div>
                    ) :
                    (
                      <div style={{ height: '100%', display: 'grid' }}>
                        <div style={{ margin: 'auto' }}>
                          <h2>No rose found for hash <br/> {hash} <br /> Sorry :(</h2>
                        </div>
                      </div>
                    )
              }
            </Grid.Column>
            <Grid.Column width={3}>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}


export default ({ url: { query: { hash } } }) => (
  <div>
    <Head>
      <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
      />
      <link href="https://fonts.googleapis.com/css?family=Supermercado+One" rel="stylesheet" />
      <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
      <title>cryptoroses.us</title>
    </Head>
    <style jsx global>{`
      html *{             
          font-family: 'Supermercado One', cursive !important;
      }

      h2, h3, h4, h5, h6 {
        color: '#1e272e' !important;
      }
    `}</style>

    <CheckRose hash={hash} />
  </div>
)
