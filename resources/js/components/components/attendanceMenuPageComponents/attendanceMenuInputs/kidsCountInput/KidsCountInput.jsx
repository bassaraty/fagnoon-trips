import React from "react";
import "./kidsCountInput.css";

const KidsCountInput = ({ name, value, onChange, placeholder, required }) => {
  // Function to handle increment
  const handleIncrement = () => {
    const newValue = (parseInt(value) || 0) + 1;
    onChange({ target: { name, value: newValue.toString() } });
  };

  // Function to handle decrement
  const handleDecrement = () => {
    const newValue = Math.max((parseInt(value) || 0) - 1, 0); // Prevent negative values
    onChange({ target: { name, value: newValue.toString() } });
  };

  // Function to handle manual input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // Ensure only numbers are entered
    if (/^\d*$/.test(newValue)) {
      onChange({ target: { name, value: newValue } });
    }
  };

  return (
    <div className="customNumberInputContainer">
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="customNumberInput"
        required={required}
      />
      <div className="customNumberInputButtons">
        <button
          type="button"
          onClick={handleIncrement}
          className="customNumberInputButton customNumberInputButtonPlus"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="customNumberInputButton customNumberInputButtonMinus"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default KidsCountInput;
