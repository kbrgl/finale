import Typography from 'typography'

const fontFamily = [
  'Avenir',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  'Open Sans',
  'Helvetica Neue',
  'sans-serif',
]

const typography = new Typography({
  baseFontSize: '21px',
  baseLineHeight: 1.666,
  headerFontFamily: fontFamily,
  headerWeight: 800,
  bodyFontFamily: fontFamily,
  scaleRatio: 1.8,
  blockMarginBottom: 0.7,
  headerGray: 0,
  bodyGray: 0,
  overrideStyles: () => ({
    '*': {
      'box-sizing': 'border-box',
    },
    'html, body': {
      '-webkit-font-smoothing': 'antialiased',
      color: '#223052',
    },
    ul: {
      'padding-left': 0,
      'margin-left': 0,
      'list-style': 'disc inside',
    },
  }),
})

export default typography
