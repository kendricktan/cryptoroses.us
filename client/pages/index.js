import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import BuyETH from './eth.js'
import BuyGRLC from './grlc.js'
import { initGA, logPageView } from './ga.js'
import { Button, Form, Input, Menu, Grid, Segment, Image } from 'semantic-ui-react'

class HomeSegment extends React.Component {
  render() {
    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <Image src='/static/banner_cropped.png' size='small' centered/><br />
          <h2>
            Buy roses on the Ethereum blockchain via ETH or GRLC
          </h2><br />
          <Button basic color='violet' content='Buy with Ethereum (ETH)' onClick={() => this.props.handleButtonClick({ name: 'buyViaETH' })} size='large' />
          <Button basic color='olive' content='Buy with Garlicoin (GRLC)' onClick={() => this.props.handleButtonClick({ name: 'buyViaGRLC' })} size='large' />
        </div>
      </div>
    )
  }
}

class PurchaseSegment extends React.Component {
  state = { hash: '' }

  render() {
    const { hash } = this.state

    return (
      <Form>
        <h2>
          Enter your hash below to retrieve your purchase.
        </h2>

        <Form.Field>
          <Input value={hash} onChange={(e) => this.setState({ hash: e.target.value })} fluid placeholder='hash' />
        </Form.Field>

        <Form.Field>
          <Button
            onClick={() => window.open('/check?hash=' + hash, '_blank')}
            fluid basic color='blue'>Retrieve my purchase</Button>
        </Form.Field>
      </Form>
    )
  }
}

class AboutSegment extends React.Component {
  render() {
    return (
      <p>
        <h2>About</h2>
        Cryptoroses is a web app that allows you to buy a virtual rose on the Ethereum blockchain using ETH or GRLC.
        
        <h3>Disclaimer</h3>
        You are responsible for your own account, funds, and private keys. You are responsible for your own decisions. Cryptoroses is not responsible for your decisions, actions, or losses that result from using Cryptoroses. By using Cryptoroses, you acknowledge this and agree to these terms.
      </p>
    )
  }
}

class CryptoRosesTemplate extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  handleButtonClick = ({ name }) => this.setState({ activeItem: name })

  componentDidMount = () => {
    initGA()
    logPageView()
  }

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
          />
          <link href="https://fonts.googleapis.com/css?family=Quantico" rel="stylesheet" />
          <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
          <title>cryptoroses.us | ETH and GRLC accepted</title>
        </Head>
        <style jsx global>{`
          html *{             
             font-family: 'Quantico', sans-serif !important;
          }

          h2, h3, h4, h5, h6 {
            color: '#1e272e' !important;
          }
        `}</style>

        <Grid columns='equal'>
          <Grid.Column></Grid.Column>
          <Grid.Column width={8}>
            <Menu text pointing secondary size='massive'>
              <Menu.Item header>Cryptoroses.us</Menu.Item>
              <Menu.Menu position='right'>
                <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
                <Menu.Item name='purchases' active={activeItem === 'purchases'} onClick={this.handleItemClick} />
                <Menu.Item name='about' active={activeItem === 'about'} onClick={this.handleItemClick} />
              </Menu.Menu>
            </Menu>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid>

        <div style={{ marginBottom: '60px' }}>
          <Grid columns='equal'>
            <Grid.Column></Grid.Column>
            <Grid.Column width={8}>
              <Segment basic>
                {
                  (activeItem === 'home') ?
                    <HomeSegment handleButtonClick={this.handleButtonClick} /> :
                    (activeItem === 'buyViaETH') ?
                      <BuyETH /> :
                      (activeItem === 'buyViaGRLC') ?
                        <BuyGRLC /> :
                        (activeItem === 'purchases') ?
                          <PurchaseSegment /> :
                          (activeItem === 'about') ?
                            <AboutSegment/> :
                            <p>How you end up here</p>
                }
              </Segment>
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid>
        </div>

        <div style={{
          position: 'fixed',
          height: '60px',
          bottom: '0px',
          left: '0px',
          right: '0px',
          marginBottom: '0px',
          backgroundColor: '#ffffff'
        }}>
          <Grid columns='equal'>
            <Grid.Column></Grid.Column>
            <Grid.Column width={8}>
              <hr />
              <div style={{ textAlign: 'right' }}>
                <h5>&copy; CRYPTOROSES.US 2018</h5>
              </div>
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid>
        </div>
      </div >
    )
  }
}

export default CryptoRosesTemplate