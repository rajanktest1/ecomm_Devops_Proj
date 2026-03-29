function StarRating({ rating, max = 5 }) {
  return (
    <span className="stars" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

export default StarRating;
