import "./style.css";

const Input = () => {
  return (
    <div className="search-input-container">
      <input
        className="search-input"
        type="text"
        placeholder="Stop being alone..."
      />
      <span className="search-input-icon material-symbols-outlined">search</span>
    </div>
  );
};

export default Input;
