import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import QuestionItem from '../QuestionItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AssessmentRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    questionsData: [],
    activeQuestionIndex: 0,
    timeLeft: 600, // 10 minutes in seconds
    answeredQuestions: [],
  }

  componentDidMount() {
    this.getQuestionsData()
    this.timerId = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerId)
  }

  tick = () => {
    const {timeLeft} = this.state
    if (timeLeft === 0) {
      this.onTimerEnd()
    } else {
      this.setState(prevState => ({
        timeLeft: prevState.timeLeft - 1,
      }))
    }
  }

  onTimerEnd = () => {
    clearInterval(this.timerId)
    const {history} = this.props
    const {questionsData} = this.state
    const score = this.calculateScore()
    const timeTaken = 600
    history.replace('/results', {
      score,
      totalQuestions: questionsData.length,
      timeTaken,
      isTimeout: true,
    })
  }

  getQuestionsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/assess/questions'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.questions.map(question => ({
        id: question.id,
        optionsType: question.options_type,
        questionText: question.question_text,
        options: question.options.map(option => ({
          id: option.id,
          text: option.text,
          imageUrl: option.image_url,
          isCorrect: option.is_correct === 'true',
        })),
      }))

      // Initialize answered questions array
      const initialAnswers = updatedData.map(question => {
        if (question.optionsType === 'SINGLE_SELECT') {
          return {
            questionId: question.id,
            optionId: question.options[0].id,
          }
        }
        return {
          questionId: question.id,
          optionId: null,
        }
      })

      this.setState({
        questionsData: updatedData,
        apiStatus: apiStatusConstants.success,
        answeredQuestions: initialAnswers,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getQuestionsData()
  }

  onSelectOption = (questionId, optionId) => {
    this.setState(prevState => {
      const {answeredQuestions} = prevState
      const existingAnswerIndex = answeredQuestions.findIndex(
        item => item.questionId === questionId,
      )

      let updatedAnswers
      if (existingAnswerIndex !== -1) {
        updatedAnswers = answeredQuestions.map(item =>
          item.questionId === questionId ? {...item, optionId} : item,
        )
      } else {
        updatedAnswers = [...answeredQuestions, {questionId, optionId}]
      }

      return {answeredQuestions: updatedAnswers}
    })
  }

  onClickQuestionNumber = index => {
    this.setState({activeQuestionIndex: index})
  }

  onClickNextQuestion = () => {
    const {activeQuestionIndex, questionsData} = this.state
    if (activeQuestionIndex < questionsData.length - 1) {
      this.setState(prevState => ({
        activeQuestionIndex: prevState.activeQuestionIndex + 1,
      }))
    }
  }

  calculateScore = () => {
    const {answeredQuestions, questionsData} = this.state
    let score = 0

    answeredQuestions.forEach(answer => {
      const question = questionsData.find(q => q.id === answer.questionId)
      if (question && answer.optionId) {
        const selectedOption = question.options.find(
          opt => opt.id === answer.optionId,
        )
        if (selectedOption && selectedOption.isCorrect) {
          score += 1
        }
      }
    })

    return score
  }

  onSubmitAssessment = () => {
    clearInterval(this.timerId)
    const {history} = this.props
    const {questionsData, timeLeft} = this.state
    const score = this.calculateScore()
    const timeTaken = 600 - timeLeft
    history.replace('/results', {
      score,
      totalQuestions: questionsData.length,
      timeTaken,
      isTimeout: false,
    })
  }

  getAnsweredCount = () => {
    const {answeredQuestions} = this.state
    return answeredQuestions.filter(answer => answer.optionId !== null).length
  }

  getUnansweredCount = () => {
    const {questionsData} = this.state
    return questionsData.length - this.getAnsweredCount()
  }

  formatTime = () => {
    const {timeLeft} = this.state
    const hours = Math.floor(timeLeft / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#263868" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1705995397/failure-img_hzoyyc.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something went wrong</h1>
      <p className="failure-description">We are having some trouble</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderQuestionsView = () => {
    const {questionsData, activeQuestionIndex, answeredQuestions} = this.state
    const activeQuestion = questionsData[activeQuestionIndex]
    const isLastQuestion = activeQuestionIndex === questionsData.length - 1
    const selectedAnswer = answeredQuestions.find(
      item => item.questionId === activeQuestion.id,
    )

    return (
      <div className="questions-view-container">
        <div className="question-panel">
          <div className="question-header">
            <div className="timer-container">
              <p className="timer-label">Time Left</p>
              <p className="timer-value">{this.formatTime()}</p>
            </div>
          </div>

          <div className="question-content-container">
            <div className="question-info">
              <h1 className="question-number">
                Question {activeQuestionIndex + 1}
              </h1>
              <div className="question-counts">
                <p>{this.getAnsweredCount()}</p>
                <p>Answered Questions</p>
                <p>{this.getUnansweredCount()}</p>
                <p>Unanswered Questions</p>
              </div>
            </div>

            <hr className="divider" />

            <QuestionItem
              questionData={activeQuestion}
              selectedOptionId={selectedAnswer ? selectedAnswer.optionId : null}
              onSelectOption={this.onSelectOption}
            />

            <div className="navigation-buttons">
              {!isLastQuestion ? (
                <button
                  type="button"
                  className="next-question-button"
                  onClick={this.onClickNextQuestion}
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-button"
                  onClick={this.onSubmitAssessment}
                >
                  Submit Assessment
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="questions-sidebar">
          <h2 className="sidebar-heading">
            Questions ({questionsData.length})
          </h2>
          <ul className="questions-numbers-container">
            {questionsData.map((question, index) => {
              const answer = answeredQuestions.find(
                item => item.questionId === question.id,
              )
              const isAnswered = answer && answer.optionId !== null
              const isActive = index === activeQuestionIndex

              return (
                <li key={question.id}>
                  <button
                    type="button"
                    data-testid="questionItem"
                    className={`question-number-button ${
                      isActive ? 'active-question-number' : ''
                    } ${isAnswered ? 'answered-question-number' : ''}`}
                    onClick={() => this.onClickQuestionNumber(index)}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            className="submit-sidebar-button"
            onClick={this.onSubmitAssessment}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    )
  }

  renderAssessmentContent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderQuestionsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="assessment-container">
          {this.renderAssessmentContent()}
        </div>
      </>
    )
  }
}

export default AssessmentRoute
