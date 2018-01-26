import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Menu, Grid, Segment, Button } from 'semantic-ui-react'

class CryptoRosesMenuBar extends React.Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
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
    )
  }
}

export default (content) => {
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
        />
        <link href="//fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
      </Head>
      <CryptoRosesMenuBar />

      <div style={{ marginBottom: '60px' }}>
        <Grid columns='equal'>
          <Grid.Column></Grid.Column>
          <Grid.Column width={8}>
            <Segment basic>
              {content}
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
        marginBottom: '0px'        
      }}>
        <Grid columns='equal'>
          <Grid.Column></Grid.Column>
          <Grid.Column width={8}>
            <hr/>
            <div style={{textAlign: 'right'}}>
              <h4 style={{fontFamily: "'Open Sans', sans-serif"}}>&copy; CRYPTOROSES.US 2018</h4>
            </div>
          </Grid.Column>
          <Grid.Column></Grid.Column>
        </Grid>
      </div>
    </div >
  )
}