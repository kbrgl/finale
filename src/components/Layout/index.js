// @flow
import React from 'react'
import type { Node } from 'react'
import { Helmet } from 'react-helmet'

type Props = {
  children?: Node,
}
const Layout = ({ children }: Props = { children: null }) => (
  <div>
    <Helmet
      meta={[
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
        {
          name: 'theme-color',
          value: '#223052',
        },
      ]}
    />
    <div>{children}</div>
  </div>
)

export default Layout
