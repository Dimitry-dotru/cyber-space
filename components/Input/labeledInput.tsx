import "./labeledInput.css";

interface LabeledInputProps {
  id: string;
  labelText: string;
  inputPlaceholder?: string;
  containerClassName?: string;
  maxLength?: number;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  id, labelText, inputPlaceholder, containerClassName, maxLength
}) => {
  return <div className={`labeled-input-container ${containerClassName ? containerClassName : ""}`}>
    <label className="input-label" htmlFor={id}>{labelText}</label>
    <input maxLength={maxLength ? maxLength : undefined} className="input-with-label" type="text" id={`#${id}`} placeholder={inputPlaceholder ? inputPlaceholder : ""}/>
  </div>;
}

export default LabeledInput;