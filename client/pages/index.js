import React from 'react'
import Link from 'next/link'

export default () =>
  <div>
    <h1>Home</h1>
    <p>Choose how you wanna buy your virtual roses.</p>
    <div><Link href='/eth'><a>Buy with Ethereum (ETH)</a></Link></div>
    <div><Link href='/grlc'><a>Buy with Garlicoin (GRLC)</a></Link></div>
  </div>
