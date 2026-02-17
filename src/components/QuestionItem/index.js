import './index.css'

const QuestionItem = props => {
  const {questionData, selectedOptionId, onSelectOption} = props
  const {id, questionText, optionsType, options} = questionData

  const handleOptionClick = optionId => {
    onSelectOption(id, optionId)
  }

  const renderDefaultOptions = () => (
    <ul className="options-list">
      {options.map(option => {
        const isSelected = selectedOptionId === option.id
        return (
          <li
            key={option.id}
            className={`option-item ${isSelected ? 'selected-option' : ''}`}
            onClick={() => handleOptionClick(option.id)}
          >
            <button
              type="button"
              className={`option-button ${
                isSelected ? 'selected-option-button' : ''
              }`}
            >
              {option.text}
            </button>
          </li>
        )
      })}
    </ul>
  )

  const renderImageOptions = () => (
    <ul className="image-options-list">
      {options.map(option => {
        const isSelected = selectedOptionId === option.id
        return (
          <li
            key={option.id}
            className={`image-option-item ${
              isSelected ? 'selected-image-option' : ''
            }`}
          >
            <button
              type="button"
              className="image-option-button"
              onClick={() => handleOptionClick(option.id)}
            >
              <img
                src={option.imageUrl}
                alt={option.text}
                className="option-image"
              />
            </button>
            <p className="option-image-text">{option.text}</p>
          </li>
        )
      })}
    </ul>
  )

  const renderSingleSelectOptions = () => (
    <div className="single-select-container">
      <p>First option is selected by default</p>
      <select
        className="single-select-dropdown"
        value={selectedOptionId || options[0].id}
        onChange={e => handleOptionClick(e.target.value)}
      >
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  )

  const renderOptions = () => {
    switch (optionsType) {
      case 'IMAGE':
        return renderImageOptions()
      case 'SINGLE_SELECT':
        return renderSingleSelectOptions()
      case 'DEFAULT':
      default:
        return renderDefaultOptions()
    }
  }

  return (
    <div className="question-item-container">
      <p className="question-text">{questionText}</p>
      {renderOptions()}
    </div>
  )
}

export default QuestionItem
