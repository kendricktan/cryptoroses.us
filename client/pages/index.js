import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import BuyETH from './eth.js'
import BuyGRLC from './grlc.js'
import { Menu, Grid, Segment, Button } from 'semantic-ui-react'

class HomeSegment extends React.Component {
  render() {
    return (
      <Segment basic>
        <div>
          <div style={{ textAlign: 'center' }}>
            <img src='//i.imgur.com/6Hrivqn.png' /><br />
            <h2 style={{ fontFamily: "'Open Sans', sans-serif", color: '#1e272e' }}>
              Buy roses on the Ethereum blockchain via ETH or GRLC
              </h2><br />
            <Button basic color='violet' content='Buy with Ethereum (ETH)' onClick={() => this.props.handleButtonClick({ name: 'buyViaETH' })} />
            <Button basic color='olive' content='Buy with Garlicoin (GRLC)' onClick={() => this.props.handleButtonClick({ name: 'buyViaGRLC' })} />
          </div>
        </div>
      </Segment>
    )
  }
}

class CryptoRosesTemplate extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  handleButtonClick = ({ name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
          />
          <link href="//fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
        </Head>

        <Grid columns='equal'>
          <Grid.Column></Grid.Column>
          <Grid.Column width={8}>
            <Menu text pointing secondary size='massive' style={{ fontFamily: "'Open Sans', sans-serif" }}>
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
              {
                (activeItem === 'home') ?
                  <HomeSegment handleButtonClick={this.handleButtonClick} /> :
                  (activeItem === 'buyViaETH') ?
                    <BuyETH /> :
                    (activeItem === 'buyViaGRLC') ?
                      <BuyGRLC /> :
                      (activeItem === 'purchases') ?
                        <p>scan hash id</p> :
                        (activeItem === 'about') ?
                          <p>about</p> :
                          <p>How you end up here</p>
              }
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
          marginBottom: '0px'
        }}>
          <Grid columns='equal'>
            <Grid.Column></Grid.Column>
            <Grid.Column width={8}>
              <hr />
              <div style={{ textAlign: 'right' }}>
                <h4 style={{ fontFamily: "'Open Sans', sans-serif" }}>&copy; CRYPTOROSES.US 2018</h4>
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