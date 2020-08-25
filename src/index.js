import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import typography from './utils/typography'

typography.injectStyles()

ReactDOM.render(<App />, document.getElementById('app'))
