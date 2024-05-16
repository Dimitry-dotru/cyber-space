
interface ButtonProps {
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
  outlined?: boolean;
  children: React.ReactNode | React.ReactNode[];
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick, primary, secondary, type, outlined, children, disabled = false
}) => {
  return <button disabled={disabled} onClick={onClick} className={`${primary ? "btn-primary" : ""} ${outlined ? "btn-outlined" : ""} ${secondary ? "btn-secondary" : ""} btn`} type={type ? type : "button"}>
    {children}
  </button>;
}

export default Button;