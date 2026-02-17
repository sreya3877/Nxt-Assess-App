import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const HomeRoute = () => (
  <>
    <Header />
    <div className="home-container">
      <div className="home-content">
        <div className="home-text-container">
          <h1 className="home-heading">Instructions</h1>
          <ol className="instructions-list">
            <li className="instruction-item">
              <p className="instruction-text">
                <span className="instruction-label">Total Questions:</span> 10
              </p>
            </li>
            <li className="instruction-item">
              <p className="instruction-text">
                <span className="instruction-label">Types of Questions:</span>{' '}
                MCQs
              </p>
            </li>
            <li className="instruction-item">
              <p className="instruction-text">
                <span className="instruction-label">Duration:</span> 10 Mins
              </p>
            </li>
            <li className="instruction-item">
              <p className="instruction-text">
                <span className="instruction-label">Marking Scheme:</span> Every
                Correct response, get 1 mark
              </p>
            </li>
            <li className="instruction-item">
              <p className="instruction-text">
                All the progress will be lost, if you reload during the
                assessment
              </p>
            </li>
          </ol>
          <Link to="/assessment">
            <button type="button" className="start-assessment-button">
              Start Assessment
            </button>
          </Link>
        </div>
        <img
          src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1705994698/assessment_wxpgie.png"
          alt="assessment"
          className="home-desktop-img"
        />
      </div>
    </div>
  </>
)

export default HomeRoute
