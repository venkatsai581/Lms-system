// Reusable quiz question with radio-style answer selection.
export default function QuestionCard({ index, total, question, selected, onSelect }) {
  return (
    <section className="panel question-card">
      <div className="question-top">
        <span className="soft-pill">QUESTION {index + 1}</span>
        <span className="small-muted">{index + 1} of {total}</span>
      </div>
      <h3>{question.question}</h3>
      <div className="answer-options" role="radiogroup" aria-label={question.question}>
        {question.options.map((option, j) => (
          <label key={j} className={`answer-option ${selected === j ? 'chosen' : ''}`}>
            <input type="radio" name={`question-${index}`} checked={selected === j} onChange={() => onSelect(j)} />
            <span className="option-letter">{String.fromCharCode(65 + j)}</span>
            {option}
          </label>
        ))}
      </div>
    </section>
  );
}
