function RatingButtons({ intervals, onRate, disabled }) {
  const buttons = [
    { key: 'again', label: 'Again', rating: 1, interval: intervals?.again },
    { key: 'hard', label: 'Hard', rating: 2, interval: intervals?.hard },
    { key: 'good', label: 'Good', rating: 3, interval: intervals?.good },
    { key: 'easy', label: 'Easy', rating: 4, interval: intervals?.easy },
  ];

  return (
    <div className="rating-buttons">
      {buttons.map(btn => (
        <button
          key={btn.key}
          className={`rating-btn ${btn.key}`}
          onClick={() => onRate(btn.rating)}
          disabled={disabled}
        >
          <span className="rating-label">{btn.label}</span>
          <span className="rating-interval">{btn.interval || '...'}</span>
          <span className="rating-key">{btn.rating}</span>
        </button>
      ))}
    </div>
  );
}

export default RatingButtons;
