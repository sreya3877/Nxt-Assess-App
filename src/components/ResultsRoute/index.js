import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class ResultsRoute extends Component {
  state = {
    score: 0,
    totalQuestions: 10,
    timeTaken: 0,
    isTimeout: false,
  }

  componentDidMount() {
    const {location} = this.props
    if (location.state) {
      const {score, totalQuestions, timeTaken, isTimeout} = location.state
      this.setState({
        score,
        totalQuestions,
        timeTaken,
        isTimeout,
      })
    }
  }

  formatTime = seconds => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  onClickReattempt = () => {
    const {history} = this.props
    history.replace('/assessment')
  }

  renderTimeoutView = () => {
    const {score, totalQuestions} = this.state

    return (
      <div className="results-content-container">
        <img
          src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1705995626/time-up-img_epb2sl.png"
          alt="time up"
          className="result-image"
        />
        <h1 className="result-heading">Time is up!</h1>
        <p className="result-description">
          You did not complete the assessment within the time limit.
        </p>
        <p className="score-label">Your Score</p>
        <p>{score}</p>
        <button
          type="button"
          className="reattempt-button"
          onClick={this.onClickReattempt}
        >
          Reattempt
        </button>
      </div>
    )
  }

  renderSubmitView = () => {
    const {score, totalQuestions, timeTaken} = this.state

    return (
      <div className="results-content-container">
        <img
          src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1705995518/submit-img_zbpam1.png"
          alt="submit"
          className="result-image"
        />
        <h1 className="result-heading">
          Congrats! You completed the assessment.
        </h1>
        <p className="result-description">Time Taken</p>
        <p>{this.formatTime(timeTaken)}</p>
        <p className="score-label">Your Score</p>
        <p>{score}</p>
        <button
          type="button"
          className="reattempt-button"
          onClick={this.onClickReattempt}
        >
          Reattempt
        </button>
      </div>
    )
  }

  render() {
    const {location} = this.props

    if (!location.state) {
      return <Redirect to="/" />
    }

    const {isTimeout} = this.state

    return (
      <>
        <Header />
        <div className="results-container">
          {isTimeout ? this.renderTimeoutView() : this.renderSubmitView()}
        </div>
      </>
    )
  }
}

export default ResultsRoute
