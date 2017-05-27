// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'
import io from 'socket.io-client'
import metaStyles from './meta.css'
import gridStyles from './grid.css'
import $ from 'jquery'
import includes from 'lodash/includes'

/*
 * React Components
 */
class Meta extends React.Component {
  render () {
    const ruleItems = this.props.rules.map((rule, i) =>
      <li key={i}>
        {rule}
      </li>
    )

    return (
      <div>
        <div>
          <h1 className={metaStyles.titles}>{this.props.title}</h1>
          <h2 className={`${metaStyles.titles} ${metaStyles.subtitle}`}>{this.props.subtitle}</h2>
        </div>
        <ul>
          {ruleItems}
        </ul>
      </div>
    )
  }
}

class Grid extends React.Component {
  render () {
    // construct grid
    let rows = []
    for (let ri = 0; ri < Math.ceil(this.props.numItems / this.props.numCols); ri++) {
      let rowItems = []
      for (let qi = 0; qi < this.props.numCols; qi++) {
        let qNum = ri * this.props.numCols + qi + 1 // calculate the question number
        if (qNum > this.props.numItems) {
          break
        }
        let tdStyle = {}
        if (includes(this.props.viewedItems, qNum)) {
          tdStyle.opacity = 0.4
          tdStyle.border = 0
        }
        rowItems.push(
          <td style={tdStyle} className={gridStyles.cell} key={qNum} onClick={this.props.onCellClick.bind(this, qNum)}>
            {qNum}
          </td>
        )
      }
      rows.push(
        <tr className={gridStyles.row} key={ri}>
          {rowItems}
        </tr>
      )
    }

    return (
      <table className={gridStyles.table}>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}

class Question extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState () {
    return {
      showingAnswer: false,
      buttonText: 'Reveal Answer',
      answerWasRevealed: false,
      number: this.props.number
    }
  }

  onButtonClick () {
    if (this.state.showingAnswer) {
      this.setState({
        showingAnswer: false,
        buttonText: 'Reveal Answer'
      })
    } else {
      if (!this.state.answerWasRevealed) {
        this.props.onRevealAnswer(this.props.number)
      }
      this.setState({
        showingAnswer: true,
        buttonText: 'Return To Question',
        answerWasRevealed: true
      })
    }
  }

  render () {
    const pStyle = {
      marginTop: '1rem',
      marginBottom: '3rem'
    }
    let heading = this.props.number
    let body
    if (this.state.showingAnswer) {
      heading = 'A' + heading
      body = this.props.answer
    } else {
      heading = 'Q' + heading
      body = this.props.text
    }
    body = marked(body)
    return (
      <div>
        <h1>{heading}</h1>
        <p style={pStyle} dangerouslySetInnerHTML={{__html: body}} />
        <button onClick={this.onButtonClick.bind(this)}>
          {this.state.buttonText}
        </button>
      </div>
    )
  }
}

class QuestionContainer extends React.Component {
  render () {
    let content
    if (this.props.question) {
      content = (
        <Question
          onRevealAnswer={this.props.onRevealAnswer}
          number={this.props.question.number}
          text={this.props.question.text}
          key={this.props.question.number}
          answer={this.props.question.answer} />
      )
    } else {
      content = <p>
                  Select a question to begin
                </p>
    }
    return content
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState () {
    const loadMsg = 'Loading...'
    return {
      meta: {
        title: loadMsg,
        subtitle: loadMsg,
        rules: [
          loadMsg
        ]
      },
      questions: [],
      completedQuestions: [],
      question: null,
      nightMode: false
    }
  }

  loadData () {
    let socket = io()
    socket.on('data', data => {
      try {
        data = JSON.parse(data)
        let filtered = {}
        for (let key in data) {
          if (this.state.hasOwnProperty(key)) {
            filtered[key] = data[key]
          }
        }
        if (data.meta.title) {
          document.title = data.meta.title
        }
        this.setState(filtered)
      } catch (err) {
        console.error(err)
      }
    })
  }

  componentDidMount () {
    this.loadData()
  }

  onSelectQuestion (qNum) {
    let question = this.state.questions[qNum - 1]
    question.number = qNum
    this.setState({
      question
    })
    this.scrollTo('#question')
  }

  onRevealAnswer (qNum) {
    this.setState({
      completedQuestions: this.state.completedQuestions.concat(qNum)
    })
  }

  scrollTo (elem) {
    $('html, body').animate({
      scrollTop: $(elem).offset().top
    })
  }

  toggleLights () {
    this.setState({
      nightMode: !this.state.nightMode
    })
  }

  render () {
    return (
      <div className={this.state.nightMode ? 'night-mode app-root' : 'app-root'}>
        <div className="container">
          <div className='wrapper'>
            <div className='content'>
              <Meta title={this.state.meta.title} subtitle={this.state.meta.subtitle} rules={this.state.meta.rules} />
              <div onClick={this.scrollTo.bind(this, '#grid')} className='arrow down bounce'>
                ↓
              </div>
              <div onClick={this.toggleLights.bind(this)} className='lights-toggle'>
                💡
              </div>
            </div>
          </div>
          <div className='wrapper' id='grid'>
            <div className='content'>
              <Grid numItems={this.state.questions.length} numCols={6} onCellClick={this.onSelectQuestion.bind(this)} viewedItems={this.state.completedQuestions} />
            </div>
          </div>
          <div className='wrapper' id='question'>
            <div className='content'>
              <div className='eight columns'>
                <div onClick={this.scrollTo.bind(this, '#grid')} className='arrow up'>
                  ↑
                </div>
                <QuestionContainer onRevealAnswer={this.onRevealAnswer.bind(this)} question={this.state.question} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

/*
 * DOM manipulation code
 */

// nothing here yet. i'm not big on jquery.
