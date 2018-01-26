import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import CryptoRosesTemplate from './template'
import { Menu, Grid, Segment, Button } from 'semantic-ui-react'


export default () =>
  CryptoRosesTemplate(
    <Segment basic>
      <div>
        <div style={{ textAlign: 'center' }}>
          <img src='//i.imgur.com/6Hrivqn.png' /><br />
          <h2 style={{ fontFamily: "'Open Sans', sans-serif", color: '#1e272e' }}>
            Buy roses on the Ethereum blockchain via ETH or GRLC
          </h2><br/>
          <Link href='/eth'><Button basic color='violet' content='Buy with Ethereum (ETH)' /></Link> &nbsp;&nbsp;
          <Link href='/grlc'><Button basic color='olive' content='Buy with Garlicoin (GRLC)' /></Link>
        </div>        
      </div>
    </Segment>
  )
