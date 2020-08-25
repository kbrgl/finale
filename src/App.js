import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import Layout from './components/Layout'
import Button from './components/Button'

import './App.css'

import data from '../data.json'

function normalizeData(data) {
  const { meta } = data
  const lengths = data.questions.map(
    question => Math.floor(Math.log10(question.id)) + 1,
  )
  const requiredLength = Math.floor(lengths.reduce((a, b) => Math.max(a, b)))
  const questions = data.questions.map((question, index) => ({
    ...question,
    id: '0'.repeat(requiredLength - lengths[index]) + question.id,
  }))
  return { meta, questions }
}

const { meta, questions } = normalizeData(data)

function scroll() {
  window.scrollTo(0, document.documentElement.clientHeight)
}

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;

  @media (min-width: 400px) {
    width: 90%;
    padding: 0;
  }

  @media (min-width: 550px) {
    width: 80%;
  }
`

const MetaContainer = styled.div`
  margin: 0 auto;
  width: 85%;
  position: relative;
`

const Overlay = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
`

const MetaScreen = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
  background: #f5f8fe;
`

const QuestionsScreen = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  min-height: 100vh;
  flex-wrap: wrap;
`

const Questions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

const QuestionWrapper = styled.div`
  border: 1px solid #eaeaef;
  border-radius: 10px;
  flex-basis: 1/10;
  padding: 50px;
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background, border-color 0.3s;
  white-space: pre;
  cursor: pointer;

  &:hover {
    border-color: #223052;
    background: #f8f9ff;
  }
`

const OverlayQuestionWrapper = styled(Container)({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    background: 'transparent',
  },
})

const RevealWrapper = styled.div({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(to bottom, #00000000, #fff)',
})

const CloseWrapper = styled.div({
  position: 'absolute',
  top: '30px',
  right: '30px',
  height: '50px',
  width: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  overflow: 'hidden',
  background: '#2977f5',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '2rem',
  lineHeight: 0,
  cursor: 'pointer',
})

type QuestionProps = {
  id: string,
  body: string,
  answer: string,
}
class Question extends React.Component<QuestionProps> {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      showAnswer: false,
    }
  }

  render() {
    const { active, showAnswer } = this.state
    const { id, body, answer } = this.props

    return active ? (
      <Overlay>
        <CloseWrapper
          onClick={() => {
            this.setState({
              active: false,
            })
            scroll()
          }}
        >
          &times;
        </CloseWrapper>
        <OverlayQuestionWrapper>
          <h2
            style={{
              marginTop: 100,
            }}
          >
            {id}.
          </h2>
          <p
            style={{
              textAlign: 'justify',
              marginBottom: 100,
            }}
          >
            {showAnswer ? answer : body}
          </p>
        </OverlayQuestionWrapper>
        <RevealWrapper>
          <Button
            type="button"
            onClick={() => {
              this.setState({
                showAnswer: !showAnswer,
              })
            }}
          >
            {showAnswer ? 'Question' : 'Answer'}
          </Button>
        </RevealWrapper>
      </Overlay>
    ) : (
      <QuestionWrapper
        onClick={() => {
          this.setState({
            active: true,
          })
        }}
      >
        <h2
          style={{
            marginBottom: 0,
          }}
        >
          {id}
        </h2>
      </QuestionWrapper>
    )
  }
}

const styles = {
  title: {
    letterSpacing: -1,
  },
}

const App = () => (
  <Layout
    onScroll={event => {
      event.preventDefault()
    }}
  >
    <Helmet title={meta.title} />
    <MetaScreen>
      <MetaContainer>
        <h1 style={styles.title}>{meta.title}</h1>
        <h3 style={styles.subtitle}>{meta.subtitle}</h3>
        <ul>
          {meta.rules.map(rule => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <div>
          <Button
            type="button"
            onClick={() => {
              scroll()
            }}
          >
            Start
          </Button>
        </div>
      </MetaContainer>
    </MetaScreen>
    <QuestionsScreen>
      <Questions>
        {questions.map(question => (
          <Question key={question.id} {...question} />
        ))}
      </Questions>
    </QuestionsScreen>
  </Layout>
)

export default App
