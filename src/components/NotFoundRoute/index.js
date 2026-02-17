import './index.css'

const NotFoundRoute = props => {
  const onClickGoHome = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1705995770/not-found-img_ctyxsn.png"
        alt="not found"
        className="not-found-img"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-description">
        We are sorry, the page you requested could not be found
      </p>
      <button type="button" className="go-home-button" onClick={onClickGoHome}>
        Go to Home
      </button>
    </div>
  )
}

export default NotFoundRoute
